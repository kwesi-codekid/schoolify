import { mongoose } from "~/mongoose";

const SubscriptionHistorySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client_details",
    },
    plan: {
      type: String,
      enum: ["free", "premium", "ultimate"],
      default: "free",
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
    },
  },
  { timestamps: true }
);

export default SubscriptionHistorySchema;
