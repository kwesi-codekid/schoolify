import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "../mongoose.server";
// import type { EmployeeInterface } from "./types";

export default class EmployeeController {
  private request: Request;
  private domain: string;
  private session: any;
  private storage: SessionStorage;
  private Employee: any;

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

    return (async (): Promise<EmployeeController> => {
      await this.initializeModels();
      return this;
    })() as unknown as EmployeeController;
  }

  private async initializeModels() {
    const { Employee } = await connectToDomainDatabase(this.domain);
    this.Employee = Employee;
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

    // const myString = imgSrc;
    // const myArray = myString.split("|");
    // let image = await EmployeeImages.create({
    //   url: myArray[0],
    //   imageId: myArray[1],
    // });

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
