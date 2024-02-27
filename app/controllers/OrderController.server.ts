import { redirect, json } from "@remix-run/node";
import moment from "moment";
import { connectToDomainDatabase } from "~/mongoose.server";
import SettingsController from "~/controllers/SettingsController.server";
import PaymentController from "~/controllers/PaymentController";
import SenderController from "~/controllers/SenderController";
import EmployeeAuthController from "./EmployeeAuthController";

export default class OrderController {
  private request: Request;
  private domain: string;
  private Order: any;
  private Product: any;
  private Cart: any;
  private User: any;
  private ShippingTimeline: any;
  private Image: any;

  /**
   * Initialize a OrderController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<OrderController> => {
      await this.initializeModels();
      return this;
    })() as unknown as OrderController;
  }

  private async initializeModels() {
    const { User, Product, Order, Cart, Image, ShippingTimeline } =
      await connectToDomainDatabase(this.domain);

    this.User = User;
    this.Product = Product;
    this.Order = Order;
    this.Cart = Cart;
    this.Image = Image;
    this.ShippingTimeline = ShippingTimeline;
  }

  private generateOrderId(prefix: string) {
    const length = 12 - prefix.length;
    const randomString = Math.random()
      .toString(36)
      .substring(2, 2 + length);
    return `${prefix}-${randomString}`;
  }

  public async getOrders({
    page,
    search_term,
    status = "pending",
    from,
    to,
  }: {
    page: number;
    search_term?: string;
    status?: string;
    from?: string;
    to?: string;
  }) {
    const limit = 10;
    const skipCount = (page - 1) * limit;

    const fromDate = from ? new Date(from) : new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);

    const dateFilter = {
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    };

    const searchFilter = search_term
      ? {
          $and: [
            {
              $or: [
                { orderId: { $regex: search_term, $options: "i" } },
                { deliveryStatus: { $regex: status, $options: "i" } },
              ],
            },
            dateFilter,
          ],
        }
      : {
          $and: [
            dateFilter,
            { deliveryStatus: { $regex: status, $options: "i" } },
          ],
        };

    try {
      const orders = await this.Order.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "images",
          },
        })
        .populate("user")
        .exec();

      const totalOrdersCount = await this.Order.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalOrdersCount / limit);

      return { orders, totalPages };
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  }

  /**
   * A function to get details of an Order
   * @param orderId The current order ID
   * @returns Order object
   */
  public async getOrder({ orderId }: { orderId: string }) {
    try {
      const order = await this.Order.findById(orderId)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "images",
          },
        })
        .populate({
          path: "user",
          select: "_id firstName lastName email phone address",
        })
        .populate({
          path: "shippingAddress",
        })
        .exec();

      return order;
    } catch (error) {
      console.error("Error retrieving order:", error);
    }
  }

  allUserOrders = async ({ user }: { user: string }) => {
    // const limit = 10;
    // const skipCount = (page - 1) * limit;
    //
    // const totalOrdersCount = await Order.countDocuments({}).exec();
    // const totalPages = Math.ceil(totalOrdersCount / limit);

    try {
      const orders = await this.Order.find({ user })
        // .skip(skipCount)
        // .limit(limit)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "images",
          },
        })
        .populate("user")
        .exec();

      return orders;
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };

  /**
   * first step in checkout
   * @param param0 user: userId
   * @returns null
   */
  public checkout = async ({
    isShop,
    customerPhone,
    customerName,
    amountPaid,
    balance,
  }: {
    isShop: boolean;
    customerPhone: string;
    customerName: string;
    amountPaid: number;
    balance: number;
  }) => {
    try {
      const employeeAuthController = await new EmployeeAuthController(
        this.request
      );
      const employee = await employeeAuthController.getEmployeeId();

      // Step 1: Retrieve cart items for the user
      const cartItems = await this.Cart.find({ employee })
        .populate("product")
        .exec();

      if (cartItems.length === 0) {
        // Handle case where the cart is empty
        return json(
          {
            error: "Cart is empty.",
            fields: {},
          },
          { status: 400 }
        );
      }

      let totalPrice = 0;
      cartItems.forEach((cartItem) => {
        const productPrice = cartItem.product.price;
        const quantity = cartItem.quantity;
        totalPrice += productPrice * quantity;
      });

      const generalSettings = await new SettingsController(this.request);
      const settings = await generalSettings.getGeneralSettings();

      const orderId = this.generateOrderId(settings?.orderIdPrefix);
      const order = await this.Order.create({
        orderId,
        // user,
        cashier: employee,
        orderItems: cartItems,
        totalPrice,
        isShop,
        // Set other relevant order details such as total price, shipping address, payment info, etc.
      });

      // // Step 3: Move cart items to the order
      // await order.save();

      // Step 4: Empty the cart for the user
      await this.Cart.deleteMany({ user }).exec();

      // Step 5: Update order status (optional)
      // You can set the order status as needed, e.g., 'paid', 'processing', etc.
      // order.status = "paid";
      // order.status = "pending";
      // await order.save();

      for (const item of cartItems) {
        const product = await this.Product.findById(item.product);

        if (product) {
          // Increment quantitySold for the product
          product.quantitySold += item.quantity;
          product.quantity -= item.quantity;
          // Save the updated product document
          await product.save();
        }
      }

      return redirect(`/proceed_order/${order?._id}`);
    } catch (error) {
      return json(
        {
          error: { message: "Error during checkout:", error },
          fields: {},
        },
        { status: 400 }
      );
      // Handle error accordingly
    }
  };

  public completeCheckout = async ({
    orderId,
    shippingAddress,
  }: {
    shippingAddress: string;
    orderId: string;
  }) => {
    const paymentController = await new PaymentController(this.request);
    const senderController = await new SenderController(request);
    let order = await this.Order.findOne({ _id: orderId })
      .populate("user")
      .exec();

    if (!order) {
      return json(
        {
          errors: { name: "Order doesnt exists" },
        },
        { status: 400 }
      );
    }

    let hubtelResponse = await paymentController.requestHubtelPayment({
      totalAmount: order?.totalPrice,
      customerName: order?.user?.username,
      orderId: order?.orderId,
    });

    if (hubtelResponse?.status == "Success") {
      await this.Order.findOneAndUpdate(
        { _id: orderId },
        {
          shippingAddress,
        }
      );
      senderController.createEmail({
        subject: "Order Successful",
        body: `some email body!`,
      });

      return redirect(`${hubtelResponse?.data?.checkoutUrl}`);
    }

    return redirect(`/proceed_order/${orderId}`);
  };

  public orderStatus = async ({
    status,
    _id,
  }: {
    status: string;
    _id: string;
  }) => {
    try {
      await this.Order.findOneAndUpdate(
        { _id },
        {
          deliveryStatus: status,
        }
      ).exec();

      return true;
    } catch (error) {
      console.error("Error chanign order status:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };

  public orderPaymentStatus = async ({
    status,
    orderId,
    paymentReff,
  }: {
    status: string;
    orderId: string;
    paymentReff: string;
  }) => {
    try {
      await this.Order.findOneAndUpdate(
        { orderId },
        {
          status,
          paymentReff,
        }
      ).exec();

      return true;
    } catch (error) {
      console.error("Error chanign order status:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };

  public getOrderStats = async () => {
    // Calculate the start date for the last 5 months from the current date
    const currentDate = new Date();
    const startOfLast7Months = moment(currentDate)
      .subtract(7, "months")
      .startOf("month")
      .toDate();

    let orderStats; // Variable to store the result

    // Create an aggregation pipeline to calculate revenue and expenses
    const result = await this.Order.aggregate([
      {
        $match: {
          // Filter orders within the last 7 months
          deliveryDate: { $gte: startOfLast7Months },
          status: "paid", // You can adjust this based on your criteria for "paid" orders
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$deliveryDate" },
          },
          revenue: { $sum: "$totalPrice" }, // Calculate total revenue
          expenses: { $sum: 0 }, // You can add logic to calculate expenses if available
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the result
          month: "$_id", // Rename _id to 'month'
          revenue: 1,
          expenses: 1,
        },
      },
    ]);

    // Process 'result' to create your chart data
    const labels = result.map((entry) => entry.month);
    const revenueData = result.map((entry) => entry.revenue);
    const expensesData = result.map((entry) => entry.expenses);

    // Create your chart data object
    orderStats = {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenueData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.2,
        },
        {
          label: "Expenses",
          data: expensesData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.2,
        },
      ],
    };

    // 'orderStats' now contains your chart data for the latest 5 months
    return orderStats;
  };

  public getTotals = async () => {
    // Calculate Total Revenue
    const revenueResult = await this.Order.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Calculate Orders Completed
    const completedCount = await this.Order.countDocuments({
      deliveryStatus: { $in: ["shipped", "delivered"] },
    });

    // Calculate Pending Orders
    const pendingCount = await this.Order.countDocuments({
      status: { $in: ["unpaid", "paid"] },
    });

    const bestsellingProducts = await this.Product.find()
      .populate("images")
      .sort({ quantitySold: -1 })
      .limit(5)
      .exec();

    return { totalRevenue, completedCount, pendingCount, bestsellingProducts };
  };
}
