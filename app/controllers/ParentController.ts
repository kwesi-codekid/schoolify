import { redirect } from "@remix-run/node";
import type { ParentInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import AdminController from "./AdminController";
import { connectToDomainDatabase } from "~/mongoose";

export default class ParentController {
  private request: Request;
  private Parent: any;
  private domain: string;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<ParentController> => {
      await this.initializeModels();
      return this;
    })() as unknown as ParentController;
  }

  private async initializeModels() {
    const { Parent } = await connectToDomainDatabase(this.domain);
    this.Parent = Parent;
  }

  /**
   * Retrieve all Parent
   * @param param0 pag
   * @returns {parents: ParentInterface, page: number}
   */
  public async getParents({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{
    parents: ParentInterface[];
    totalPages: number;
  }> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            {
              firstName: {
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
              lastName: {
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
      const parents = await this.Parent.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        // .populate("church")
        // .populate("denomination")
        // .populate("appointingOfficer")
        .sort({ name: "asc" })
        .exec();

      const totalParentsCount = await this.Parent.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalParentsCount / limit);

      return { parents, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error retrieving parents",
        status: "error",
        description: error.message,
      });
      return redirect("/admin/parents", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  public async getParent({ id }: { id: string }) {
    try {
      const branch = await this.Parent.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ branch: id }).populate("user");

      // branch.reviews = reviews;
      return branch;
    } catch (error) {
      console.error("Error retrieving branch:", error);
    }
  }

  /**
   * Create a new branch
   * @param path string
   * @param name string
   * @param description string
   * @returns ParentInterface
   */
  public createParent = async ({
    path,
    firstName,
    lastName,
    gender,
    dob,
    studentClass,
    address,
  }: {
    path: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    studentClass: string;
    address: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const adminController = await new AdminController(this.request);

    try {
      const existingParent = await this.Parent.findOne({
        firstName,
        lastName,
      });

      if (existingParent) {
        session.flash("message", {
          title: "Parent already exists",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const branch = await this.Parent.create({
        firstName,
        lastName,
        gender,
        dob,
        class: studentClass,
        address,
      });

      if (!branch) {
        session.flash("message", {
          title: "Error Adding Parent",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      session.flash("message", {
        title: "Parent Added Successful",
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
        title: "Error Adding Parent",
        status: "error",
        description: error.message,
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Import parents from csv
   * @param data Array of parents
   * @returns null
   */
  public importBatch = async (data) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const parents = await this.Parent.create(data);
    if (!parents) {
      session.flash("message", {
        title: "Error Importing Parents",
        status: "error",
      });
      return redirect(`/admin/parents`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Parents Imported Successful",
      status: "success",
    });
    return redirect(`/admin/parents`, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Update branch
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updateParent = async ({
    path,
    _id,
    firstName,
    lastName,
    gender,
    dob,
    studentClass,
    address,
  }: {
    path: string;
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    studentClass: string;
    address: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.Parent.findByIdAndUpdate(_id, {
        firstName,
        lastName,
        gender,
        dob,
        class: studentClass,
        address,
      });

      session.flash("message", {
        title: "Parent Updated Successful",
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
        title: "Error Updating Parent",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteParent = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.Parent.findByIdAndDelete(_id);

      session.flash("message", {
        title: "Parent Deleted Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (err) {
      console.log(err);

      session.flash("message", {
        title: "Error Deleting Parent",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
