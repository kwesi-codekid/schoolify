import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "~/mongoose.server";

export default class WishlistController {
  private request: Request;
  private domain: string;
  private session: any;
  private storage: SessionStorage;
  private WishList: any;
  private Product: any;
  private Image: any;

  /**
   * Initialize a WishlistController instance
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

    return (async (): Promise<WishlistController> => {
      await this.initializeModels();
      return this;
    })() as unknown as WishlistController;
  }

  private async initializeModels() {
    const { WishList, Product, Image } = await connectToDomainDatabase(
      this.domain
    );

    this.WishList = WishList;
    this.Product = Product;
    this.Image = Image;
  }

  /**
   * Get the current user's wishlist
   * @returns Wishlist
   */
  public addToWishlist = async ({
    user,
    product,
  }: {
    user: string;
    product: string;
  }) => {
    const existingItem = await this.WishList.findOne({
      user,
      product,
    });

    if (existingItem) {
      this.WishList.findOneAndUpdate(
        { _id: existingItem._id },
        {
          $inc: { quantity: 1 },
        }
      ).exec();
    } else {
      const cart = await this.WishList.create({
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

  public getUserWishlist = async ({ user }: { user: string }) => {
    try {
      const wishlist = await this.WishList.find({ user }).populate({
        path: "product",
        populate: {
          path: "images",
          model: "images",
        },
      });

      return wishlist;
    } catch (error) {
      console.error("Error retrieving wishlist:", error);
    }
  };

  /**
   * Delete an item from the wishlist
   * @param id String
   * @returns null
   */
  public deleteItem = async ({ id }: { id: string }) => {
    // delete entry
    try {
      await this.WishList.findByIdAndDelete(id);
      return json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (err) {
      throw err;
    }
  };
}
