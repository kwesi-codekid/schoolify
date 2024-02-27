import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "~/mongoose.server";
import UserSchema from "~/models/User";
import { PaymentDetailSchema } from "../models/PaymentDetails";

export default class PaymentDetailsController {
  private request: Request;
  private domain: string;
  private session: any;
  private storage: SessionStorage;
  private PaymentDetails: any;
  private User: any;

  /**
   * Initialize a PaymentDetailsController instance
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

    return (async (): Promise<PaymentDetailsController> => {
      await this.initializeModels();
      return this;
    })() as unknown as PaymentDetailsController;
  }

  private async initializeModels() {
    const clientDb = await connectToDomainDatabase(this.domain);
    try {
      this.PaymentDetails = clientDb.model("payment_details");
      this.User = clientDb.model("users");
    } catch (error) {
      this.PaymentDetails = clientDb.model(
        "payment_details",
        PaymentDetailSchema
      );
      this.User = clientDb.model("users", UserSchema);
    }
  }

  public addPaymentDetails = async ({
    user,
    method,
    mobileNumber,
  }: {
    user: string;
    method: string;
    mobileNumber: string;
  }) => {
    const existingPaymentDetail = await this.PaymentDetails.findOne({
      user,
      method,
    });

    if (existingPaymentDetail) {
      this.PaymentDetails.findOneAndUpdate(
        { _id: existingPaymentDetail._id },
        {
          $inc: { quantity: 1 },
        }
      ).exec();
    } else {
      // create new admin
      const cart = await this.PaymentDetails.create({
        user,
        product,
        quantity: 1,
      });

      if (!cart) {
        return json(
          {
            error: "Error creating cart",
            fields: {},
          },
          { status: 400 }
        );
      }
    }

    return redirect(`"/products/${product}"`, 200);
  };

  public getUserPaymentDetails = async ({ user }: { user: string }) => {
    try {
      const payment_details = await this.PaymentDetails.find({ user });

      return payment_details;
    } catch (error) {
      console.error("Error retrieving carts:", error);
    }
  };
}
