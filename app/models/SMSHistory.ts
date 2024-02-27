import { mongoose } from "~/mongoose";

const SMSHistorySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

export default SMSHistorySchema;
