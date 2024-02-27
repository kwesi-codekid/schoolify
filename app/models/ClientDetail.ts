import { mongoose } from "~/mongoose.server";

const ClientDetailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: String,
    phone: String,
    password: String,
    propagated: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscription_histories",
    },
  },
  { timestamps: true }
);

export default ClientDetailSchema;
