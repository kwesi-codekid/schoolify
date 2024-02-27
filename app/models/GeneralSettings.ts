import { mongoose } from "~/mongoose.server";

const GeneralSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    siteDescription: String,
    siteLogo: {
      type: String,
    },
    favicon: String,
    slogan: String,
    keywords: String,
    email: String,
    phone: String,
    address: String,
    facebook: String,
    twitter: String,
    instagram: String,
    orderIdPrefix: String,
    allowInscription: {
      type: Boolean,
      default: false,
    },
    allowRegistration: {
      type: Boolean,
      default: false,
    },
    allowCheckout: {
      type: Boolean,
      default: false,
    },
    allowGuestCheckout: {
      type: Boolean,
      default: false,
    },
    allowGuestReview: {
      type: Boolean,
      default: false,
    },
    allowGuestComment: {
      type: Boolean,
      default: false,
    },
    allowGuestRating: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "themes",
    },
    language: {
      type: String,
      // required: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default GeneralSettingsSchema;

// // Seed the admin settings document
// const seedAdminSettings = async () => {
//   try {
//     const update = {
//       language: "en",
//       notifications: true,
//       businessName: "My Business Name",
//       siteLogo: "https://via.placeholder.com/150",
//     };

//     const options = {
//       upsert: true, // Create if the document doesn't exist
//       new: true, // Return the updated document
//     };

//     const adminSettings = await AdminSettings.findOneAndUpdate(
//       {},
//       update,
//       options
//     ).exec();
//     return adminSettings;
//   } catch (error) {
//     // Handle error
//     console.error("Error seeding admin settings:", error);
//     throw error;
//   }
// };

// export { AdminSettings, seedAdminSettings };

// payment api setting
// notification
// general
// billing
// themes
// integrations
