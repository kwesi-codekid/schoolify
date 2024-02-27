import { mongoose } from "~/mongoose.server";

const SMSHistorySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

export default SMSHistorySchema;
