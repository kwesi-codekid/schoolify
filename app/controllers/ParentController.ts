import { redirect } from "@remix-run/node";
import type { StudentInterface } from "../types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import AdminController from "./AdminController";
import { connectToDomainDatabase } from "~/mongoose";

export default class StudentController {
  private request: Request;
  private Student: any;
  private domain: string;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<StudentController> => {
      await this.initializeModels();
      return this;
    })() as unknown as StudentController;
  }

  private async initializeModels() {
    const { Student } = await connectToDomainDatabase(this.domain);
    this.Student = Student;
  }

  /**
   * Retrieve all Student
   * @param param0 pag
   * @returns {students: StudentInterface, page: number}
   */
  public async getStudents({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{
    students: StudentInterface[];
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
      const students = await this.Student.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        // .populate("church")
        // .populate("denomination")
        // .populate("appointingOfficer")
        .sort({ name: "asc" })
        .exec();

      const totalStudentsCount = await this.Student.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalStudentsCount / limit);

      return { students, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error retrieving students",
        status: "error",
        description: error.message,
      });
      return redirect("/admin/students", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  public async getStudent({ id }: { id: string }) {
    try {
      const branch = await this.Student.findById(id).populate("images");
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
   * @returns StudentInterface
   */
  public createStudent = async ({
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
      const existingStudent = await this.Student.findOne({
        firstName,
        lastName,
      });

      if (existingStudent) {
        session.flash("message", {
          title: "Student already exists",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const branch = await this.Student.create({
        firstName,
        lastName,
        gender,
        dob,
        class: studentClass,
        address,
      });

      if (!branch) {
        session.flash("message", {
          title: "Error Adding Student",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      session.flash("message", {
        title: "Student Added Successful",
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
        title: "Error Adding Student",
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
   * Import students from csv
   * @param data Array of students
   * @returns null
   */
  public importBatch = async (data) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const students = await this.Student.create(data);
    if (!students) {
      session.flash("message", {
        title: "Error Importing Students",
        status: "error",
      });
      return redirect(`/admin/students`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Students Imported Successful",
      status: "success",
    });
    return redirect(`/admin/students`, {
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
  public updateStudent = async ({
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
      await this.Student.findByIdAndUpdate(_id, {
        firstName,
        lastName,
        gender,
        dob,
        class: studentClass,
        address,
      });

      session.flash("message", {
        title: "Student Updated Successful",
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
        title: "Error Updating Student",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteStudent = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.Student.findByIdAndDelete(_id);

      session.flash("message", {
        title: "Student Deleted Successful",
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
        title: "Error Deleting Student",
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
