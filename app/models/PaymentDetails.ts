import { mongoose } from "~/mongoose.server";

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
    },
    cardNumber: String,
    phoneNumber: String,
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "card", "momo", "cheque"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const PaymentDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    method: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const GuestPaymentDetailsSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// let PaymentDetails: mongoose.Model<PaymentDetailInterface>;
// try {
//   PaymentDetails = mongoose.model<PaymentDetailInterface>("carts");
// } catch (error) {
//   PaymentDetails = mongoose.model<PaymentDetailInterface>("carts", PaymentDetailSchema);
// }
export { PaymentDetailSchema, GuestPaymentDetailsSchema };

export default PaymentSchema;
