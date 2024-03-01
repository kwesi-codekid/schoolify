import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "~/mongoose";
import { type ObjectId } from "mongoose";
import { commitSession, getSession } from "~/auth-session";
import { commitFlashSession, getFlashSession } from "~/flash-session";

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

  public async requireAdminId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getAdminSession();

    const adminId = session.get("adminId");
    if (!adminId || typeof adminId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/admin/login?${searchParams}`);
    }

    return adminId;
  }

  public async getAdmin() {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const adminId = await this.requireAdminId();

    try {
      const admin = await this.Admin.findById(adminId).select("-password");

      // if (!admin) {
      //   throw this.logout();
      // }

      if (!admin) {
        session.flash("message", {
          title: "No Account!",
          status: "error",
        });
        return redirect(`/admin/login`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

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

    const admin = await this.Admin.findOne({
      email,
    });

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    // console.log(admin);

    if (!admin) {
      session.flash("message", {
        title: "No Account with email!",
        status: "error",
      });
      return redirect(`/admin/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      session.flash("message", {
        title: "Invalid Credentials",
        status: "error",
      });
      return redirect(`/admin/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return this.createAdminSession(admin.id, "/admin");
  }

  public updateProfile = async ({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const userId = await this.getAdminId();
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const user = await this.Admin.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          email,
        },
        {
          new: true,
        }
      );
      session.flash("message", {
        title: "Profile Updated",
        status: "success",
      });
      return redirect(`/admin/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Updating Profile!",
        status: "error",
      });
      return redirect(`/admin/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public changePassword = async ({
    currentPassword,
    password,
  }: {
    currentPassword: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const userId = await this.getAdminId();
    const admin = await this.Admin.findById(userId);

    if (admin) {
      const valid = await bcrypt.compare(currentPassword, admin.password);

      if (!valid) {
        session.flash("message", {
          title: "Incorrect Password!",
          status: "error",
        });
        return redirect(`/admin/profile`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.Admin.findByIdAndUpdate(admin._id, {
        password: hashedPassword,
      });
      session.flash("message", {
        title: "Password Changed",
        status: "success",
      });
      return redirect(`/admin/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } else {
      session.flash("message", {
        title: "User does not exist!",
        status: "error",
      });
      return redirect(`/admin/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public async logout() {
    const session = await this.getAdminSession();

    return redirect("/admin/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public createAdmin = async ({
    path,
    firstName,
    lastName,
    email,
    password,
    role,
  }: {
    path: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await this.Admin.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });

      session.flash("message", {
        title: "Admin Created",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Creating Admin!",
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

  public getAdmins = async ({
    page,
    search_term,
  }: {
    page: number;
    search_term: string;
  }) => {
    const limit = 10; // Number of orders per page
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            { name: { $regex: search_term, $options: "i" } }, // Case-insensitive search for email
            { description: { $regex: search_term, $options: "i" } }, // Case-insensitive search for username
          ],
        }
      : {};

    const totalEmployeeCount = await this.Admin.countDocuments({}).exec();
    const totalPages = Math.ceil(totalEmployeeCount / limit);

    try {
      const admins = await this.Admin.find(searchFilter)
        .populate("role")
        .skip(skipCount)
        .limit(limit)
        .exec();

      return { admins, totalPages };
    } catch (error) {
      console.error("Error retrieving admins:", error);
    }
  };

  public deleteAdmin = async ({
    adminId,
    path,
  }: {
    adminId: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.Admin.findByIdAndDelete(adminId);
      session.flash("message", {
        title: "Admin Deleted",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Deleting Admin!",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public updateAdminProfile = async ({
    adminId,
    path,
    firstName,
    lastName,
    email,
    role,
  }: {
    adminId: string;
    path: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await this.Admin.findByIdAndUpdate(adminId, {
        firstName,
        lastName,
        email,
        role,
      });
      session.flash("message", {
        title: "Admin Updated",
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
        title: "Error Updating Admin!",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public resetPassword = async ({
    adminId,
    path,
    password,
  }: {
    adminId: string;
    path: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.Admin.findByIdAndUpdate(adminId, {
        password: hashedPassword,
      });
      session.flash("message", {
        title: "Password Reset",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Resetting Password!",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public canPerformAction = async (action: string): Promise<any> => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const admin = await this.getAdmin();

    try {
      // Assuming admin has a role associated with it
      const role = await Role.findById(admin.role).populate("permissions");

      if (!role) {
        session.flash("message", {
          title: "No role Assigned!",
          status: "error",
        });
        return redirect("/", {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      // Check if the role has the necessary permission
      const canPerform = role.permissions.some(
        (permission) => permission.action === action
      );

      if (!canPerform) {
        return false;
        console.log(canPerform);
        session.flash("message", {
          title: "Permission Denied!",
          status: "error",
        });
        return redirect(`/admin`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }
      console.log("can perform", canPerform);

      return true;
    } catch (error) {
      session.flash("message", {
        title: "Permission Denied!",
        status: "error",
      });
      return redirect(`/`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      console.error("Error checking permission:", error);
      return false;
    }
  };
}
