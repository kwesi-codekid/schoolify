import { mongoose } from "~/mongoose";

const FeeStructureSchema = new mongoose.Schema(
  {
    tuition: {
      type: String,
      required: true,
    },
    extra_charges: String,
  },
  {
    timestamps: true,
  }
);

export default FeeStructureSchema;
