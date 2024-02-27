import { mongoose } from "~/mongoose";
//  there will be two versions of this, one for global and one for client
// global one will be lsited on client, for them to be able see newly added payment methods
//  and once the client enables one, it get copied to their instance: allowing them to enter
// the necessary credentials
const PaymentApiSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    apiToken: {
      type: String,
      required: true,
    },
    api_endpoint: {
      type: String,
      required: true,
    },
    image: String,
    description: String,
  },
  { timestamps: true }
);

export { PaymentApiSchema };
