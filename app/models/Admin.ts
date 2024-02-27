import { mongoose } from "~/mongoose.server";

const AdminSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    email: { type: String, unique: true },
    username: String,
    password: String,
    role: String,
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permissions",
      },
    ],
    clientConnection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientConnections",
    },
  },
  { timestamps: true }
);

export default AdminSchema;
