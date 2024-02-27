import {
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "~/mongoose";
import { commitFlashSession, getFlashSession } from "~/flash-session";

export default class TeacherController {
  private request: Request;
  private domain: string;
  private session: any;
  private Employee: any;
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
    const { Employee } = await connectToDomainDatabase(this.domain);
    this.Employee = Employee;
  }

  private async createEmployeeSession(employeeId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("employeeId", employeeId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getEmployeeSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  public async loginEmployee({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const employee = await this.Employee.findOne({ email });

    if (!employee) {
      session.flash("message", {
        title: "No Employee Found",
        status: "error",
      });
      return redirect(`/pos/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, employee.password);

    if (!valid) {
      session.flash("message", {
        title: "Invalid Password",
        status: "error",
      });
      return redirect(`/pos/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    // const logController = await new LogController();
    // await logController.create({
    //   employee: employee?._id,
    //   action: "login",
    // });

    return this.createEmployeeSession(employee._id, "/pos");
  }

  public async requireEmployeeId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getEmployeeSession();

    const employeeId = session.get("employeeId");
    if (!employeeId || typeof employeeId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/pos/login?${searchParams}`);
    }

    return employeeId;
  }

  public async getEmployeeId() {
    const session = await this.getEmployeeSession();
    const employeeId = session.get("employeeId");
    if (!employeeId || typeof employeeId !== "string") {
      return null;
    }

    return employeeId;
  }

  public async getEmployee() {
    const employeeId = await this.getEmployeeId();
    if (typeof employeeId !== "string") {
      return null;
    }

    try {
      const employee = await this.Employee.findById(employeeId).select(
        "-password"
      );
      return employee;
    } catch {
      throw this.logout();
    }
  }

  public async logout() {
    const id = await this.getEmployeeId();
    // const logController = await new LogController();
    // await logController.create({
    //   employee: id as string,
    //   action: "logout",
    // });

    const session = await this.getEmployeeSession();

    return redirect("/pos/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public getEmployees = async ({ page }: { page: number }) => {
    const limit = 10;
    const skipCount = (page - 1) * limit;

    const totalEmployeeCount = await this.Employee.countDocuments({}).exec();
    const totalPages = Math.ceil(totalEmployeeCount / limit);

    try {
      const employees = await this.Employee.find({})
        .skip(skipCount)
        .limit(limit)
        .exec();

      return { employees, totalPages };
    } catch (error) {
      console.error("Error retrieving employees:", error);
    }
  };

  /**
   * create an employee
   * @param param0 firstNmae
   *
   * @returns
   */
  public createEmployee = async ({
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
    const existingEmployee = await this.Employee.findOne({ username });

    if (existingEmployee) {
      return json(
        {
          errors: { name: "Employee already exists" },
          fields: { firstName, lastName, middleName, username, email },
        },
        { status: 400 }
      );
    }

    // create new admin
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await this.Employee.create({
      firstName,
      middleName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role,
      gender,
    });

    if (!employee) {
      return json(
        {
          error: "Error creating employee",
          fields: { firstName, lastName, middleName, username, email },
        },
        { status: 400 }
      );
    }
    return redirect("/console/employees", 200);
  };

  /**
   * get a single employee
   * @param param0
   * @returns
   */
  public getEmployee = async (id: string) => {
    try {
      const employee = await this.Employee.findById(id);
      return employee;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Update employee
   * @param param0
   */
  public updateEmployee = async ({
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
    await this.Employee.findOneAndUpdate(
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
    return redirect(`/console/employees`, 200);
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

  public deleteEmployee = async (id: string) => {
    try {
      await this.Employee.findByIdAndDelete(id);
      return json(
        { message: "Employee deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      throw err;
    }
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
//   const Employee = clientDb.model("employees", EmployeeSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const employee = await Employee.create({
//     username,
//     email,
//     password: hashedPassword,
//   });

//   if (!employee) {
//     return json(
//       { error: "Error creating employee", fields: { username, email } },
//       { status: 400 }
//     );
//   }

//   return createEmployeeSession(employee.id, "/pos");
// };

// export const changePassword = async (
//   employeeId: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const clientDb = await connectToDomainDatabase(domain);
//   const Employee = clientDb.model("employees", EmployeeSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);

//   let employee = await Employee.updateOne(
//     { _id: employeeId },
//     { password: hashedPassword },
//     { new: true }
//   );

//   return employee;
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
//   const Employee = clientDb.model("employees", EmployeeSchema);

//   const employeeId = await requireEmployeeId(request);

//   if (typeof employeeId !== "string") {
//     return null;
//   }

//   try {
//     const employee: EmployeeInterface = await Employee.findById(employeeId).select(
//       "id email username role permissions"
//     );

//     // filter permissions to check if there is any match for the action
//     const hasPermission = employee.permissions.filter((permission) => {
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

//     return employee;
//   } catch {
//     throw logout(request);
//   }
// };
