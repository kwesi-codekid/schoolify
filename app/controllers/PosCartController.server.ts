import { json, redirect } from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";
import EmployeeAuthController from "./EmployeeAuthController";
import { commitFlashSession, getFlashSession } from "~/flash-session";

export default class PosCartController {
  private request: Request;
  private domain: string;
  private Cart: any;
  private Product: any;
  private Image: any;

  /**
   * Initialize a PosCartController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<PosCartController> => {
      await this.initializeModels();
      return this;
    })() as unknown as PosCartController;
  }

  private async initializeModels() {
    const { Cart, Product, Image } = await connectToDomainDatabase(this.domain);

    this.Cart = Cart;
    this.Product = Product;
    this.Image = Image;
  }

  private async generateOrderId(prefix: string) {
    const length = 10 - prefix.length;
    const randomString = Math.random()
      .toString(36)
      .substring(2, 2 + length);
    return `${prefix}-${randomString}`;
  }

  public addToCart = async ({ product }: { product: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    const existingCart = await this.Cart.findOne({
      employee: cashier,
      product,
    });

    if (existingCart) {
      this.Cart.findByIdAndUpdate(existingCart._id, {
        $inc: { quantity: 1 },
      }).exec();

      session.flash("message", {
        title: "Product already in cart",
        status: "success",
      });
      return redirect("/personal_data", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } else {
      const cart = await this.Cart.create({
        employee: cashier,
        product,
        quantity: 1,
      });

      if (!cart) {
        session.flash("message", {
          title: "Error adding product to cart",
          status: "error",
        });
        return redirect(`/pos/products`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }
    }

    session.flash("message", {
      title: "Product Added to Cart",
      status: "success",
    });
    return redirect(`/pos/products`, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  public getUserCart = async ({ user }: { user: string }) => {
    try {
      const carts = await this.Cart.find({ employee: user })
        .populate({
          path: "product",
          populate: [
            { path: "images", model: "images" },
            { path: "category", model: "categories" },
            // { path: "stockHistory", model: "stocks" },
          ],
        })
        // .populate({
        //   path: "stock",
        //   model: "stocks",
        // })
        .exec();

      return carts;
    } catch (error) {
      console.error("Error retrieving carts:", error);
    }
  };

  public increaseItem = async ({ product }: { product: string }) => {
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await this.Cart.findOneAndUpdate(
        { product, employee: cashier },
        {
          $inc: { quantity: 1 }, // Increase the quantity by 1
        }
      ).exec();

      return redirect(`/pos/products`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
      // Handle the error appropriately
    }
  };

  public setStock = async ({
    product,
    stock,
  }: {
    product: string;
    stock: string;
  }) => {
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await this.Cart.findOneAndUpdate(
        { product, user: cashier },
        {
          stock,
        }
      ).exec();

      return redirect(`/pos/products`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };

  /**
   * Delete a record from the cart
   * @param param0 id
   * @returns null
   */
  public decreaseItem = async ({ product }: { product: string }) => {
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await this.Cart.findOneAndUpdate(
        { product, employee: cashier },
        {
          $inc: { quantity: -1 }, // Decrease the quantity by 1
        }
      ).exec();

      return redirect(`/pos/products`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      // Handle the error appropriately
    }
  };

  /**
   * Delete an item from the cart
   * @param id String
   * @returns null
   */
  public removeFromCart = async ({ product }: { product: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await this.Cart.findOneAndDelete({ employee: cashier, product });
      session.flash("message", {
        title: "Product removed from cart",
        status: "success",
      });
      return redirect(`/pos/products`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error deleting product from cart",
        status: "error",
      });
      return redirect(`/pos/products`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public addInscription = async ({
    inscription,
    id,
  }: {
    inscription: string;
    id: string;
  }) => {
    try {
      await this.Cart.findByIdAndUpdate(id, {
        inscription,
      }).exec();

      return redirect(`/cart`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };
}
