import { mongoose } from "~/mongoose.server";

const ThemesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    templateFiles: {
      type: [String], // Assuming an array of file paths
      default: [],
    },
    stylesheets: {
      type: [String], // Assuming an array of file paths
      default: [],
    },
    jsFiles: {
      type: [String], // Assuming an array of file paths
      default: [],
    },
    assets: {
      type: [String], // Assuming an array of file paths
      default: [],
    },
    options: {
      type: mongoose.Schema.Types.Mixed, // Assuming a flexible object for options
      default: {},
    },
    dependencies: {
      type: [String], // Assuming an array of dependencies
      default: [],
    },
  },
  { timestamps: true }
);

export default ThemesSchema;
