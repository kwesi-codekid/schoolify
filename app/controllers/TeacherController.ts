import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "~/mongoose";
import { commitFlashSession, getFlashSession } from "~/flash-session";

export default class TeacherController {
  private request: Request;
  private domain: string;
  private Teacher: any;
  private storage: SessionStorage;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });

    return (async (): Promise<TeacherController> => {
      await this.initializeModels();
      return this;
    })() as unknown as TeacherController;
  }

  private async initializeModels() {
    const { Teacher } = await connectToDomainDatabase(this.domain);
    this.Teacher = Teacher;
  }

  private async createTeacherSession(teacherId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("teacherId", teacherId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getTeacherSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  public async getTeacherId() {
    const session = await this.getTeacherSession();
    const teacherId = session.get("teacherId");
    if (!teacherId || typeof teacherId !== "string") {
      return null;
    }

    return teacherId;
  }

  public async loginTeacher({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const teacher = await this.Teacher.findOne({ email });

    if (!teacher) {
      session.flash("message", {
        title: "No Teacher Found",
        status: "error",
      });
      return redirect(`/teacher/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, teacher.password);

    if (!valid) {
      session.flash("message", {
        title: "Invalid Password",
        status: "error",
      });
      return redirect(`/teacher/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    // const logController = await new LogController();
    // await logController.create({
    //   teacher: teacher?._id,
    //   action: "login",
    // });

    return this.createTeacherSession(teacher._id, "/teacher");
  }

  public async requireTeacherId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getTeacherSession();

    const teacherId = session.get("teacherId");
    if (!teacherId || typeof teacherId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/teacher/login?${searchParams}`);
    }

    return teacherId;
  }

  public async getTeacher() {
    const teacherId = await this.getTeacherId();

    try {
      const teacher = await this.Teacher.findById(teacherId).select(
        "-password"
      );

      if (!teacher) {
        return this.logout();
      }

      return teacher;
    } catch {
      return this.logout();
    }
  }

  public async logout() {
    const id = await this.getTeacherId();
    // const logController = await new LogController();
    // await logController.create({
    //   teacher: id as string,
    //   action: "logout",
    // });

    const session = await this.getTeacherSession();

    return redirect("/teacher/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public getTeachers = async ({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term: string;
    limit?: number;
  }) => {
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

    const totalTeacherCount = await this.Teacher.countDocuments({}).exec();
    const totalPages = Math.ceil(totalTeacherCount / limit);

    try {
      const teachers = await this.Teacher.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();

      return { teachers, totalPages };
    } catch (error) {
      console.error("Error retrieving teachers:", error);
    }
  };

  /**
   * create an teacher
   * @param param0 firstNmae
   *
   * @returns
   */
  public createTeacher = async ({
    path,
    firstName,
    lastName,
    gender,
    email,
    password,
    address,
    phone,
    profileImage,
  }: {
    path: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    gender: string;
    phone: string;
    profileImage: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingTeacher = await this.Teacher.findOne({ email, phone });

      if (existingTeacher) {
        session.flash("message", {
          title: "Teacher already exists",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = await this.Teacher.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        address,
        phone,
        profileImage,
      });

      if (!teacher) {
        session.flash("message", {
          title: "Error creating teacher",
          status: "error",
        });
        return redirect(path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      session.flash("message", {
        title: "No Teacher Found",
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
        title: "Error creating teacher",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * get a single teacher
   * @param param0
   * @returns
   */
  public getTeacherDetails = async (id: string) => {
    const teacher = await this.Teacher.findById(id);
    return teacher;
  };

  /**
   * Update teacher
   * @param param0
   */
  public updateTeacher = async ({
    _id,
    path,
    firstName,
    lastName,
    gender,
    email,
    address,
    phone,
  }: {
    _id: string;
    path: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    // try {
    await this.Teacher.findOneAndUpdate(
      { _id },
      {
        firstName,
        lastName,
        gender,
        email,
        address,
        phone,
      }
    );

    session.flash("message", {
      title: "Teacher updated successfully",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  public deleteTeacher = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    await this.Teacher.findByIdAndDelete(_id);

    session.flash("message", {
      title: "Teacher deleted successfully",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };
}

// export const signup = async (
//   username: string,
//   email: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const clientDb = await connectToDomainDatabase(domain);
//   const Teacher = clientDb.model("teachers", TeacherSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const teacher = await Teacher.create({
//     username,
//     email,
//     password: hashedPassword,
//   });

//   if (!teacher) {
//     return json(
//       { error: "Error creating teacher", fields: { username, email } },
//       { status: 400 }
//     );
//   }

//   return createTeacherSession(teacher.id, "/teacher");
// };

// export const changePassword = async (
//   teacherId: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const clientDb = await connectToDomainDatabase(domain);
//   const Teacher = clientDb.model("teachers", TeacherSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);

//   let teacher = await Teacher.updateOne(
//     { _id: teacherId },
//     { password: hashedPassword },
//     { new: true }
//   );

//   return teacher;
// };

// export const requirePermission = async ({
//   request,
//   action,
// }: {
//   request: Request;
//   action: string;
// }) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];
//   const clientDb = await connectToDomainDatabase(domain);
//   const Teacher = clientDb.model("teachers", TeacherSchema);

//   const teacherId = await requireTeacherId(request);

//   if (typeof teacherId !== "string") {
//     return null;
//   }

//   try {
//     const teacher: TeacherInterface = await Teacher.findById(teacherId).select(
//       "id email username role permissions"
//     );

//     // filter permissions to check if there is any match for the action
//     const hasPermission = teacher.permissions.filter((permission) => {
//       return permission.action === action;
//     });

//     if (hasPermission.length === 0) {
//       return json(
//         {
//           message: `Unauthorized: You can not perform ${action}`,
//           type: "error",
//         },
//         { status: 401 }
//       );
//     }

//     return teacher;
//   } catch {
//     throw logout(request);
//   }
// };
