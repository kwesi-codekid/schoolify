import { mongoose } from "~/mongoose";

const StudentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    gender: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
    },
    fees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fees",
      },
    ],
  },
  { timestamps: true }
);

export default StudentSchema;
