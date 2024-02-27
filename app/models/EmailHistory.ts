import { mongoose } from "~/mongoose";

const EmailHistorySchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    subject: String,
    body: String,
    storeName: String,
    status: {
      type: String,
      enum: ["new", "sent"],
      default: "new",
    },
    storeId: String,
  },
  { timestamps: true }
);

export default EmailHistorySchema;

// payment api setting
// notification
// general
// billing
// themes
// integrations
