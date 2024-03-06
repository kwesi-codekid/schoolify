import { mongoose } from "~/mongoose";

const ParentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    title: {
      type: String,
    },
    wards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
      },
    ],
  },
  { timestamps: true }
);

export default ParentSchema;
