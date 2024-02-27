import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose";

const StockHistorySchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: Number,
    operation: String,
  },
  { timestamps: true }
);

export default StockHistorySchema;
