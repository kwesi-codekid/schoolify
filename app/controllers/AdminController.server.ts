import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "../mongoose.server";
import { type ObjectId } from "mongoose";
import { commitSession, getSession } from "~/auth-session";

export default class AdminController {
  private request: Request;
  private domain: string;
  private session: any;
  private Admin: any;
  private storage: SessionStorage;
  private connectionDetails: {
    databaseUri: string;
    username: string;
    password: string;
    _id: ObjectId;
    admin: string;
    storeName: string;
    email: string;
    phone: string;
    createdAt: string;
  };

  /**
   * Initialize a AdminController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
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

    return (async (): Promise<AdminController> => {
      await this.initializeModels();
      return this;
    })() as unknown as AdminController;
  }

  private async initializeModels() {
    const { Admin, connectionDetails } = await connectToDomainDatabase(
      this.domain
    );
    this.Admin = Admin;
    this.connectionDetails = connectionDetails;
  }

  private async createAdminSession(adminId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("adminId", adminId);
    session.set("store_details", this.connectionDetails);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getAdminSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  /**
   * Get the current logged in user's Id
   * @returns admin_id :string
   */
  public async getAdminId() {
    const session = await this.getAdminSession();
    const adminId = session.get("adminId");
    if (!adminId || typeof adminId !== "string") {
      return null;
    }
    return adminId;
  }

  public async getCurrentAdmin() {
    const adminId = await this.getAdminId();
    if (typeof adminId !== "string") {
      return null;
    }

    try {
      const admin = await this.Admin.findById(adminId).select("-password");
      return admin;
    } catch {
      throw this.logout();
    }
  }

  public async loginAdmin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const admin = await this.Admin.findOne({ email });

    if (!admin) {
      session.flash("message", {
        title: "No account associated with this Email",
        status: "error",
      });
      return redirect(`/console/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      session.flash("message", {
        title: "Invalid Password",
        status: "error",
      });
      return redirect(`/console/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return this.createAdminSession(admin._id, "/console");
  }

  public async logout() {
    const session = await this.getAdminSession();

    return redirect("/console/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public async requireAdminId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getAdminSession();

    const adminId = session.get("adminId");
    if (!adminId || typeof adminId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/console/login?${searchParams}`);
    }

    return adminId;
  }

  /**
   * Get all admins
   * @param param0 page: number
   * @returns Admins: Array, totalPages: number
   */
  public getAdmins = async ({
    page,
    search_term,
  }: {
    page: number;
    search_term: string;
  }) => {
    try {
      const limit = 10;
      const skipCount = (page - 1) * limit;
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
                email: {
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

      const admins = await this.Admin.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();
      const totalAdminCount = await this.Admin.countDocuments({}).exec();
      const totalPages = Math.ceil(totalAdminCount / limit);

      return { admins, totalPages };
    } catch (error) {
      console.error("Error retrieving admins:", error);
    }
  };

  /**
   * create an admin
   * @param param0 firstNmae
   * @returns
   */
  public createAdmin = async ({
    firstName,
    middleName,
    lastName,
    email,
    username,
    password,
    role,
    gender,
  }: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    gender: string;
  }) => {
    const existingAdmin = await this.Admin.findOne({ username });

    if (existingAdmin) {
      return json(
        {
          errors: { name: "Admin already exists" },
          fields: { firstName, lastName, middleName, username, email },
        },
        { status: 400 }
      );
    }

    // const myString = imgSrc;
    // const myArray = myString.split("|");
    // let image = await AdminImages.create({
    //   url: myArray[0],
    //   imageId: myArray[1],
    // });

    // create new admin
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.Admin.create({
      firstName,
      middleName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role,
      gender,
    });

    if (!admin) {
      return json(
        {
          error: "Error creating admin",
          fields: { firstName, lastName, middleName, username, email },
        },
        { status: 400 }
      );
    }
    return redirect("/console/users/admins", 200);
  };

  /**
   * get a single admin
   * @param param0
   * @returns
   */
  public getAdmin = async (id: string) => {
    const admin = await this.Admin.findById(id);
    return admin;
  };

  /**
   * Update admin
   * @param param0
   */
  public updateAdmin = async ({
    firstName,
    middleName,
    lastName,
    email,
    username,
    role,
    gender,
    _id,
  }: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    gender: string;
    _id: string;
  }) => {
    // try {
    await this.Admin.findOneAndUpdate(
      { _id },
      {
        firstName,
        middleName,
        lastName,
        email,
        username,
        role,
        gender,
      }
    );
    return redirect(`/console/users/admins`, 200);
    // } catch (error) {
    //   return json(
    //     {
    //       errors: {
    //         name: "Error occured while updating product category",
    //         error: error,
    //       },
    //       fields: {
    //         firstName,
    //         middleName,
    //         lastName,
    //         email,
    //         username,
    //         role,
    //         gender,
    //       },
    //     },
    //     { status: 400 }
    //   );
    // }
  };

  public deleteAdmin = async (id: string) => {
    await this.Admin.findByIdAndDelete(id);
    return json({ message: "Admin deleted successfully" }, { status: 200 });
  };
}

// export const changePassword = async (
//   adminId: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const clientDb = await connectToDomainDatabase(domain);
//   const Admin = clientDb.model("admins", AdminSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);

//   let admin = await Admin.updateOne(
//     { _id: adminId },
//     { password: hashedPassword },
//     { new: true }
//   );

//   return admin;
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
//   const Admin = clientDb.model("admins", AdminSchema);

//   const adminId = await requireAdminId(request);

//   if (typeof adminId !== "string") {
//     return null;
//   }

//   try {
//     const admin: AdminInterface = await Admin.findById(adminId).select(
//       "id email username role permissions"
//     );

//     // filter permissions to check if there is any match for the action
//     const hasPermission = admin.permissions.filter((permission) => {
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

//     return admin;
//   } catch {
//     throw logout(request);
//   }
// };
