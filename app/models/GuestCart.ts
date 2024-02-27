import { mongoose } from "~/mongoose";

const GuestCartSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
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

export default GuestCartSchema;
