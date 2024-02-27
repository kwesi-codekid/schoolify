import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose.server";

const ProductSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    description: String,
    costPrice: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    availability: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "images",
      },
    ],
    quantitySold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default ProductSchema;
