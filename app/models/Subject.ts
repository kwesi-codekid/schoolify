import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose";

const SubjectSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    description: String,

    availability: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "images",
      },
    ],
  },
  { timestamps: true }
);

export default SubjectSchema;
