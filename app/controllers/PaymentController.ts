import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "~/mongoose.server";
import axios from "axios";
import OrderController from "~/controllers/OrderController.server";

export default class PaymentController {
  private request: Request;
  private domain: string;
  private session: any;
  private Cart: any;
  private Product: any;
  private Image: any;
  private Payment: any;
  private storage: SessionStorage;

  /**
   * Initialize a PaymentController instance
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

    return (async (): Promise<PaymentController> => {
      await this.initializeModels();
      return this;
    })() as unknown as PaymentController;
  }

  private async initializeModels() {
    const { Cart, Product, Image, Payment } = await connectToDomainDatabase(
      this.domain
    );

    this.Cart = Cart;
    this.Product = Product;
    this.Image = Image;
    this.Payment = Payment;
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

  public requestHubtelPayment = async ({
    totalAmount,
    customerName,
    orderId,
  }: {
    totalAmount: number;
    customerName: string;
    orderId: string;
  }) => {
    return new Promise<{
      responseCode: string;
      status: string;
      data: {
        checkoutUrl: string;
        checkoutId: string;
        clientReference: string;
        message: string;
        checkoutDirectUrl: string;
      };
    }>(async (resolve, reject) => {
      try {
        const data = JSON.stringify({
          totalAmount,
          description: customerName,
          callbackUrl:
            "https://webhook.site/a6849fb9-e114-4a2c-afe8-f8e062547e34",
          returnUrl: "http://kwamina.com:3000/api/hubtell_callback",
          merchantAccountNumber: "2017174",
          cancellationUrl: "http://hubtel.com/",
          clientReference: orderId,
        });

        // Convert the input string to a binary string
        const binaryString = unescape(
          encodeURIComponent("pQn0DNm:a1d146a4492c41cdbe2263250adf6bf8")
        );

        // Encode the binary string using Base64
        const encodedString = btoa(binaryString);

        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://payproxyapi.hubtel.com/items/initiate",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedString}`,
          },
          data: data,
        };

        const response = await axios.request(config);
        resolve(response.data);
      } catch (error) {
        reject({
          responseCode: "400",
          status: "Error",
          data: {},
        });
      }
    });
  };

  public hubtelCallback = async ({
    orderId,
    paymentReff,
  }: {
    orderId: string;
    paymentReff: string;
  }) => {
    const orderController = await new OrderController(this.request);
    await orderController.orderPaymentStatus({
      status: "paid",
      orderId,
      paymentReff,
    });
    return json({ message: "Success" }, 200);
  };

  public getOrderPayments = async ({ orderId }: { orderId: string }) => {
    const payments = await this.Payment.find({ order: orderId }).populate(
      "cashier"
    );
    return payments;
  };
}
