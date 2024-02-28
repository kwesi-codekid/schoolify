import { mongoose } from "~/mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    gender: String,
    status: String,
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subjects",
      },
    ],
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "classes",
      },
    ],
  },
  { timestamps: true }
);

export default TeacherSchema;
