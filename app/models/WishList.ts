import { mongoose } from "~/mongoose.server";

const WishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  },
  {
    timestamps: true,
  }
);

export default WishListSchema;
