import { json, redirect } from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";
import { CategoryInterface } from "~/types";

export default class CategoryController {
  private request: Request;
  private domain: string;
  private Category: any;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<CategoryController> => {
      await this.initializeModels();
      return this;
    })() as unknown as CategoryController;
  }

  private async initializeModels() {
    const { Category } = await connectToDomainDatabase(this.domain);

    this.Category = Category;
  }

  public async createCategory({
    name,
    description,
    status,
    featured,
  }: {
    name: string;
    description: string;
    status: string;
    featured: string;
  }) {
    const existingCategory = await this.Category.findOne({ name });

    if (existingCategory) {
      return json(
        {
          errors: { name: "Category already exists" },
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }

    // create new admin
    const category = await this.Category.create({
      name,
      status,
      description,
      featured: featured == "true" ? 1 : 0,
    });

    if (!category) {
      return json(
        {
          error: "Error creating category",
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }
    return redirect("/console/categories", 200);
  }

  public getCategories = async ({
    page,
    search_term,
  }: {
    page: number;
    search_term?: string;
  }): Promise<{ categories: CategoryInterface[]; totalPages: number }> => {
    try {
      const limit = 10;
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

      const categories = await this.Category.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();

      const totalProductsCount = await this.Category.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalProductsCount / limit);

      return { categories, totalPages };
    } catch (error) {
      console.error("Error retrieving categories:", error);
      throw new Error("Error retrieving categories");
    }
  };

  public async getFeaturedCategories() {
    try {
      const categories = await this.Category.find({
        featured: true,
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getActiveCategories() {
    try {
      const categories = await this.Category.find({
        status: "active",
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async updateCategory({
    _id,
    name,
    description,
    status,
    featured,
  }: {
    _id: string;
    name: string;
    description: string;
    status: string;
    featured: string;
  }) {
    try {
      await this.Category.findOneAndUpdate(
        { _id },
        {
          name,
          status,
          description,
          featured: featured == "true" ? true : false,
        }
      );
      return redirect(`/console/categories`, 200);
    } catch (error) {
      return json(
        {
          errors: {
            name: "Error occured while updating product category",
            error: error,
          },
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }
  }

  public deleteCategory = async (id: string) => {
    try {
      await this.Category.findByIdAndDelete(id);
      return json(
        { message: "Category deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      throw err;
    }
  };
}
