import { mongoose } from "~/mongoose.server";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
    },
    color: String,
    inscription: String,
  },
  {
    timestamps: true,
  }
);

export default CartSchema;
