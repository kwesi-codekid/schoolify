import { mongoose } from "~/mongoose";

const ShippingTimelineSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    location: String,
    message: String,
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "failed",
        "disputed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default ShippingTimelineSchema;
