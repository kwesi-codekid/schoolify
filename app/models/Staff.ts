import { mongoose } from "~/mongoose";

const StaffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    gender: String,
    status: String,
  },
  { timestamps: true }
);

export default StaffSchema;
