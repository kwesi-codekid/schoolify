import { mongoose } from "~/mongoose.server";

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    action: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE"],
      default: "GET",
    },
  },
  { timestamps: true }
);

export default PermissionSchema;
