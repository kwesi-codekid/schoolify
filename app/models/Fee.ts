import { mongoose } from "~/mongoose";

const FeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    amount_due: Number,
    amount_paid: Number,
    due_date: Date,
  },
  {
    timestamps: true,
  }
);

export default FeeSchema;
