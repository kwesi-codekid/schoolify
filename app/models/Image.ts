import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose";

const ImageSchema: Schema = new mongoose.Schema(
  {
    url: String,
    imageId: String,
  },
  { timestamps: true }
);

export default ImageSchema;
