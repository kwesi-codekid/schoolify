import { mongoose } from "~/mongoose.server";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: String,
  },
  { timestamps: true }
);

export default ReviewSchema;
