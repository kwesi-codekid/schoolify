import type { Schema } from "mongoose";
import { mongoose } from "~/mongoose.server";

const ImageSchema: Schema = new mongoose.Schema(
  {
    url: String,
    imageId: String,
  },
  { timestamps: true }
);

export default ImageSchema;
