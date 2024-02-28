import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose";

const ResultSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
    },
    score: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default ResultSchema;
