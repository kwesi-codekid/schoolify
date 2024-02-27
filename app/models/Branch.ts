import { mongoose } from "~/mongoose.server";

const BranchSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    address: String,
  },
  {
    timestamps: true,
  }
);

export default BranchSchema;
