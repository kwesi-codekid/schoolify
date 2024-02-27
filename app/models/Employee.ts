import { mongoose } from "~/mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    username: String,
    password: String,
    role: String,
    gender: String,
    status: String,
    // permissions: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "permissions",
    //   },
    // ],
    clientConnection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientConnections",
    },
  },
  { timestamps: true }
);

export default EmployeeSchema;
