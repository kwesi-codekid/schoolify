import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import { connectToDomainDatabase } from "~/mongoose.server";

// import { getClientIPAddress } from "remix-utils";

export default class UserController {
  private request: Request;
  private domain: string;
  private storage: SessionStorage;
  private session: any;
  private User: any;
  private Address: any;
  private Image: any;

  /**
   * Initialize a UserController instance
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

    return (async (): Promise<UserController> => {
      await this.initializeModels();
      return this;
    })() as unknown as UserController;
  }

  private async initializeModels() {
    const { User, Address, Image } = await connectToDomainDatabase(this.domain);
    this.User = User;
    this.Address = Address;
    this.Image = Image;
  }

  private async getUserSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  private async createUserSession(userId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  /**
   * create id for the current guest using current timestamp
   * @param redirectTo string
   * @returns id string
   */
  public createGuestSession = async (redirectTo: string) => {
    // random string for guest id
    let guestId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const session = await this.storage.getSession();
    session.set("guestId", guestId);
    console.log("create:", { guestId });
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  };

  public async requireUserId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getUserSession();

    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/login?${searchParams}`);
    }

    return userId;
  }

  public async getUserId() {
    const session = await this.getUserSession();
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      return null;
    }

    return userId;
  }

  /**
   * Get current guest Id
   * @returns String
   */
  public async getGuestId() {
    const session = await this.getUserSession();
    const guestId = await session.get("guestId");

    if (!guestId || typeof guestId !== "string") {
      return null;
    }

    return guestId;
  }

  /**
   * Login a user
   * @param email User Email
   * @param password User Password
   * @returns null if no user found, else returns a session
   */
  public loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const user = await this.User.findOne({
      email,
    });

    if (!user) {
      return json({ error: "No user found" }, 400);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return json(
        {
          error: "Invalid Credentials",
          fields: { email, password },
        },
        { status: 400 }
      );
    }

    return this.createUserSession(user._id, "/");
  };

  /**
   * Register a new User account
   * @param username User's username
   * @param email User's email
   * @param password User's password
   * @returns null if user already exists, else returns a session
   */
  public registerUser = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const existingUser = await this.User.findOne({ email });

    if (existingUser) {
      return json(
        {
          errors: { email: "Email already exists" },
          fields: { username, email, password },
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return json(
        { error: "Error creating user", fields: { username, email } },
        { status: 400 }
      );
    }

    return this.createUserSession(user._id, "/");
  };

  /**
   * Get the current user
   * @returns UserInterface
   */
  public getUser = async () => {
    const userId = await this.getUserId();

    try {
      const user = await this.User.findById(userId, {
        email: true,
        username: true,
        lastName: true,
        firstName: true,
        middleName: true,
      });
      return user;
    } catch {
      // throw new Error("Error retrieving products");
      throw this.logout();
    }
  };

  public update = async ({
    firstName,
    lastName,
    username,
    email,
    image,
  }: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    image: string;
  }) => {
    const userId = await this.getUserId();
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      let imageRes = null;
      if (image) {
        imageRes = await this.Image.create({
          url: image,
        });
      }
      await this.User.findOneAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          email,
          username,
          profileImage: imageRes ? imageRes?._id : null,
        }
      );
      session.flash("message", {
        title: "Profile Updated Successful",
        status: "success",
      });
      return redirect("/personal_data", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      return json(
        {
          errors: { email: "Error occured" },
          fields: { firstName, lastName, email, username },
        },
        { status: 400 }
      );
    }
  };

  public changePassword = async ({
    current_password,
    password,
  }: {
    current_password: string;
    password: string;
  }) => {
    const userId = await this.getUserId();
    const user = await this.User.findById(userId);

    if (user) {
      const valid = await bcrypt.compare(current_password, user.password);

      if (!valid) {
        return json(
          {
            error: "Incorrect Password",
            fields: { password },
          },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.User.findOneAndUpdate(
        { _id: user._id },
        {
          password: hashedPassword,
        }
      );

      return redirect("/personal_data");
    } else {
      return json(
        {
          error: "Incorrect Password",
          fields: { password },
        },
        { status: 400 }
      );
    }
  };

  /**
   * Gell all users
   * @returns Users[]
   */
  public getCustomers = async () => {
    try {
      const customers = await this.User.find({});

      return customers;
    } catch (error) {
      console.error("Error retrieving customers:", error);
    }
  };

  /**
   * Logout a user
   * @returns null
   */
  public logout = async () => {
    const session = await this.getUserSession();

    return redirect("/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  };

  public getUserAddresses = async () => {
    const userId = await this.getUserId();

    try {
      const user = await this.Address.find({ user: userId });
      return user;
    } catch {
      // throw new Error("Error retrieving products");
      throw this.logout();
    }
  };

  public addUserAddress = async ({
    address,
    city,
    title,
  }: {
    address: string;
    city: string;
    title: string;
  }) => {
    const userId = await this.getUserId();

    try {
      const newAddress = await this.Address.create({
        address,
        city,
        title,
        user: userId,
      });

      return redirect("/addresses");
    } catch {
      // throw new Error("Error retrieving products");
      throw this.logout();
    }
  };

  public trackVisit = async () => {
    // let ipAddress = getClientIPAddress(this.request);
    // let ipAddresss = getClientIPAddress(this.request.headers);
    // const userAgent = this.request.headers["user-agent"];
    // const timestamp = new Date();
    // // Create a new visit record
    // const visit = new Visit({
    //   ipAddress: ip,
    //   userAgent,
    //   timestamp,
    // });
    // try {
    //   // Save the visit record to MongoDB
    //   await visit.save();
    // } catch (error) {
    //   console.error('Error tracking visit:', error);
    // }
    // // Continue processing the request
    // next();
  };
}
