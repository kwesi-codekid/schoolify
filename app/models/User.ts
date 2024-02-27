import { mongoose } from "~/mongoose.server";

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    username: String,
    password: String,
    phone: String,
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "images",
    },
  },
  { timestamps: true }
);

export default UserSchema;
