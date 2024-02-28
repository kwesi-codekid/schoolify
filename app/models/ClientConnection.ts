import { mongoose } from "~/mongoose";

const ClientConnectionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client_details",
    },
    schoolName: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    domain: {
      type: String,
      unique: true,
    },
    databaseUri: String,
    businessName: String,
    dbName: String,
    dbPassword: String,
  },
  { timestamps: true }
);

export default ClientConnectionSchema;
