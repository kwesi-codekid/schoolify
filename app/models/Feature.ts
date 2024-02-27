import { mongoose } from "~/mongoose.server";

const FeatureSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    request_type: {
      type: String,
      enum: ["feature", "error", "suggestion"],
      default: "feature",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["open", "wip", "completed", "reviewed", "available"],
      default: "open",
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        content: String,
        createdAt: Date,
      },
    ],
    upvotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default FeatureSchema;
