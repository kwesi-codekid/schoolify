import { mongoose } from "~/mongoose.server";

const NotificationSchema = new mongoose.Schema(
  {
    apiKey: {
      type: String,
      required: true,
    },
    apiToken: {
      type: String,
      required: true,
    },
    api_endpoint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default NotificationSchema;
