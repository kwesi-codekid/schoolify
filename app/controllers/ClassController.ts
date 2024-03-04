import { redirect } from "@remix-run/node";
import type { StudentClassInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import AdminController from "./AdminController";
import { connectToDomainDatabase } from "~/mongoose";

export default class ClassController {
  private request: Request;
  private StudentClass: any;
  private domain: string;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<ClassController> => {
      await this.initializeModels();
      return this;
    })() as unknown as ClassController;
  }

  private async initializeModels() {
    const { StudentClass } = await connectToDomainDatabase(this.domain);

    this.StudentClass = StudentClass;
  }

  /**
   * Retrieve all StudentClass
   * @param param0 pag
   * @returns {classes: StudentClassInterface, page: number}
   */
  public async getStudentClasss({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{
    classes: StudentClassInterface[];
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
      const classes = await this.StudentClass.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("teacher")
        .sort({ name: "asc" })
        .exec();

      const totalStudentClasssCount = await this.StudentClass.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalStudentClasssCount / limit);

      return { classes, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error retrieving classes",
        status: "error",
        description: error.message,
      });
      return redirect("/admin/classes", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  public async getStudentClass({ id }: { id: string }) {
    try {
      const branch = await this.StudentClass.findById(id).populate("images");
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
   * @returns StudentClassInterface
   */
  public createStudentClass = async ({
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
      const existingStudentClass = await this.StudentClass.findOne({
        firstName,
        lastName,
      });

      if (existingStudentClass) {
        session.flash("message", {
          title: "StudentClass already exists",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const branch = await this.StudentClass.create({
        firstName,
        lastName,
        gender,
        dob,
        class: studentClass,
        address,
      });

      if (!branch) {
        session.flash("message", {
          title: "Error Adding StudentClass",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      session.flash("message", {
        title: "StudentClass Added Successful",
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
        title: "Error Adding StudentClass",
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
   * Import classes from csv
   * @param data Array of classes
   * @returns null
   */
  public importBatch = async (data) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const classes = await this.StudentClass.create(data);
    if (!classes) {
      session.flash("message", {
        title: "Error Importing StudentClasss",
        status: "error",
      });
      return redirect(`/admin/classes`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "StudentClasss Imported Successful",
      status: "success",
    });
    return redirect(`/admin/classes`, {
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
  public updateStudentClass = async ({
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
      await this.StudentClass.findByIdAndUpdate(_id, {
        firstName,
        lastName,
        gender,
        dob,
        class: studentClass,
        address,
      });

      session.flash("message", {
        title: "StudentClass Updated Successful",
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
        title: "Error Updating StudentClass",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteStudentClass = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.StudentClass.findByIdAndDelete(_id);

      session.flash("message", {
        title: "StudentClass Deleted Successful",
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
        title: "Error Deleting StudentClass",
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
