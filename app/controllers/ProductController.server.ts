import { json, redirect } from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";
import AdminController from "./AdminController.server";
import EmployeeAuthController from "./EmployeeAuthController";
import { commitFlashSession, getFlashSession } from "~/flash-session";

export default class ProductController {
  private request: Request;
  private domain: string;
  private Product: any;
  private Image: any;
  private Category: any;
  private StockHistory: any;
  private Reviews: any;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<ProductController> => {
      await this.initializeModels();
      return this;
    })() as unknown as ProductController;
  }

  private async initializeModels() {
    const { Product, Image, Category, StockHistory } =
      await connectToDomainDatabase(this.domain);

    this.Product = Product;
    this.Image = Image;
    this.Category = Category;
    this.StockHistory = StockHistory;
  }

  public async getProducts({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }) {
    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              name: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              description: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }
      : {};

    try {
      const products = await this.Product.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("images")
        .populate("category")
        .sort({ name: "asc" })
        .exec();

      const totalProductsCount = await this.Product.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalProductsCount / limit);

      return { products, totalPages, page };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving products");
    }
  }

  public async getProductsByCategory({
    page,
    search_term,
    limit = 10,
    category,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
    category: string;
  }) {
    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          category,
          $or: [
            {
              name: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              description: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }
      : {
          category,
        };

    try {
      const products = await this.Product.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("images")
        .populate("category")
        .sort({ name: "asc" })
        .exec();

      const totalProductsCount = await this.Product.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalProductsCount / limit);

      return { products, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving products");
    }
  }

  public async getProduct({ id }: { id: string }) {
    try {
      const product = await this.Product.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ product: id }).populate("user");
      // product.reviews = reviews;
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
      throw error;
    }
  }

  public createProduct = async ({
    path,
    name,
    price,
    costPrice,
    description,
    images,
    category,
    quantity,
  }: {
    path: string;
    name: string;
    price: string;
    costPrice: string;
    description: string;
    images: string[];
    category: string;
    quantity: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const existingProduct = await this.Product.findOne({ name });

    if (existingProduct) {
      session.flash("message", {
        title: "Product already exists",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    let successfulIds: string[] = [];
    if (images.length > 0) {
      const imagePromises = images.map(async (image) => {
        try {
          const imageRes = await this.Image.create({
            url: image,
          });
          return imageRes;
        } catch (error) {
          console.error(`Error creating product image: ${error}`);
          // Handle the error as needed
          return null;
        }
      });
      const results = await Promise.all(imagePromises);
      const successfulResults = results.filter((result) => result !== null);
      successfulIds = successfulResults.map((result) => result?._id);
    }

    // create new admin
    const product = await this.Product.create({
      name,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      description,
      category: category ? category : null,
      availability: "available",
      images: [...successfulIds],
      quantity: parseInt(quantity),
    });

    if (!product) {
      session.flash("message", {
        title: "Error Adding Product",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Product Added Successful",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  public updateProduct = async ({
    path,
    _id,
    name,
    price,
    costPrice,
    description,
    category,
  }: {
    path: string;
    _id: string;
    name: string;
    price: string;
    description: string;
    costPrice: string;
    category: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.Product.findByIdAndUpdate(_id, {
        name,
        costPrice: parseFloat(costPrice),
        price: parseFloat(price),
        description,
        category,
      });

      session.flash("message", {
        title: "Product Updated Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Updating Product",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public stockProduct = async ({
    _id,
    quantity,
    operation,
  }: {
    _id: string;
    quantity: string;
    operation: string;
  }) => {
    const product = await this.Product.findById(_id);

    if (operation == "add") {
      product.quantity += parseInt(quantity);
      await product.save();
    } else {
      product.quantity -= parseInt(quantity);
      await product.save();
    }

    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();
    if (adminId) {
      await this.StockHistory.create({
        user: adminId,
        product: _id,
        quantity,
        operation,
      });
      return redirect(`/console/products/${_id}`, 200);
    }

    const employeeAuthController = await new EmployeeAuthController(
      this.request
    );
    const userId = await employeeAuthController.getEmployeeId();

    if (userId) {
      await this.StockHistory.create({
        user: userId,
        product: _id,
        quantity,
        operation,
      });
      return redirect(`/console/products/${_id}`, 200);
    }

    // try {
    //   await this.Product.findOneAndUpdate(
    //     { _id },
    //     {
    //       quantity,
    //     }
    //   );
    // } catch (error) {
    //   return json(
    //     {
    //       errors: {
    //         name: "Error occured while updating product",
    //         error: error,
    //       },
    //       fields: { quantity },
    //     },
    //     { status: 400 }
    //   );
    // }
  };

  public deleteProduct = async (id: string) => {
    try {
      await this.Product.findByIdAndDelete(id);
      return json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      throw err;
    }
  };

  public addProductImage = async ({
    productId,
    images,
  }: {
    productId: string;
    images: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const imagePromises = images.map(async (image) => {
      try {
        const imageRes = await this.Image.create({
          url: image,
          product: productId,
        });
        return imageRes;
      } catch (error) {
        console.error(`Error creating product image: ${error}`);
        // Handle the error as needed
        return null;
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(imagePromises);
    const successfulResults = results.filter((result) => result !== null);
    console.log(successfulResults);

    try {
      const product = await this.Product.findById(productId);

      const successfulIds = successfulResults.map((result) => result?._id);
      product.images.push(...successfulIds);
      await product.save();

      session.flash("message", {
        title: "Image Added Successful",
        status: "success",
      });
      return redirect(`/console/products/${productId}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error Adding Image",
        status: "error",
      });
      return redirect(`/console/products/${productId}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
