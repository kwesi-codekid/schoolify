import { mongoose } from "~/mongoose.server";

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
