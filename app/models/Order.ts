import { mongoose } from "~/mongoose.server";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: false,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    isShop: {
      type: Boolean,
      default: false,
    },
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "pickup",
    },
    paymentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments",
    },
    status: {
      type: String,
      enum: [
        "unpaid",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "failed",
        "disputed",
      ],
      default: "unpaid",
    },
    shipping_timelines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shipping_timelines",
      },
    ],
    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    paymentReff: String,
  },

  {
    timestamps: true,
  }
);

export default OrderSchema;
