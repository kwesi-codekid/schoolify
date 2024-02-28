import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose";

const ClassSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fee_structures",
    },
  },
  { timestamps: true }
);

export default ClassSchema;
