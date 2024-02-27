import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";

export default class GuestCartController {
  private request: Request;
  private domain: string;
  private session: any;
  private storage: SessionStorage;
  private GuestCart: any;
  private Product: any;
  private Image: any;

  /**
   * Initialize a GuestCartController instance
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

    return (async (): Promise<GuestCartController> => {
      await this.initializeModels();
      return this;
    })() as unknown as GuestCartController;
  }

  private async initializeModels() {
    const { Product, Image, GuestCart } = await connectToDomainDatabase(
      this.domain
    );

    this.Product = Product;
    this.Image = Image;
    this.GuestCart = GuestCart;
  }

  private async generateOrderId(prefix: string) {
    const length = 10 - prefix.length;
    const randomString = Math.random()
      .toString(36)
      .substring(2, 2 + length);
    return `${prefix}-${randomString}`;
  }

  /**
   * Add item to guest cart
   * @param param0 product Id
   * @returns
   */
  public addToCart = async ({
    guestId,
    product,
  }: {
    guestId: string;
    product: string;
  }) => {
    const existingCart = await this.GuestCart.findOne({
      guestId,
      product,
    });

    if (existingCart) {
      this.GuestCart.findOneAndUpdate(
        { _id: existingCart._id },
        {
          $inc: { quantity: 1 },
        }
      ).exec();
    } else {
      const cart = await this.GuestCart.create({
        guestId,
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

    return redirect(`/products/${product}`, 200);
  };

  public getGuestCart = async ({ guestId }: { guestId: string }) => {
    const carts = await this.GuestCart.find({ guestId }).populate({
      path: "product",
      populate: {
        path: "images",
        model: "images",
      },
    });
    return carts;
  };

  public increaseItem = async ({
    product,
    guestId,
  }: {
    product: string;
    guestId: string;
  }) => {
    await this.GuestCart.findOneAndUpdate(
      { product, guestId },
      {
        $inc: { quantity: 1 }, // Increase the quantity by 1
      }
    ).exec();

    return true;
  };

  /**
   * Delete a record from the cart
   * @param param0 id
   * @returns null
   */
  public decreaseItem = async ({
    product,
    guestId,
  }: {
    product: string;
    guestId: string;
  }) => {
    await this.GuestCart.findOneAndUpdate(
      { product, guestId },
      {
        $inc: { quantity: -1 }, // Decrease the quantity by 1
      }
    ).exec();

    return true;
  };

  /**
   * Delete an item from the cart
   * @param id String
   * @returns null
   */
  public deleteItem = async ({ id }: { id: string }) => {
    await this.GuestCart.findByIdAndDelete(id);
    return true;
  };

  public addInscription = async ({
    inscription,
    id,
  }: {
    inscription: string;
    id: string;
  }) => {
    try {
      await this.GuestCart.findOneAndUpdate(
        { _id: id },
        {
          inscription,
        }
      ).exec();

      return redirect(`/cart`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
      // Handle the error appropriately
    }
  };
}
