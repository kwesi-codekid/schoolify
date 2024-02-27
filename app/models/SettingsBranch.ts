import { mongoose } from "~/mongoose";

const SettingsBranchSchema = new mongoose.Schema(
  {
    multipleBranches: {
      type: Boolean,
      default: false,
    },
    productSeparation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default SettingsBranchSchema;
