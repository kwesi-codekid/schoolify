import mongoose, { type Document, type Model, type Connection } from "mongoose";
import ImageSchema from "~/models/Image";
import ProductSchema from "~/models/Product";
import EmployeeSchema from "~/models/Employee";
import CategorySchema from "~/models/Category";
import AdminSchema from "~/models/Admin";
import CartSchema from "~/models/Cart";
import GuestCartSchema from "~/models/GuestCart";
import UserSchema from "~/models/User";
import StockHistorySchema from "~/models/StockHistory";
import OrderSchema from "~/models/Order";
import ShippingTimelineSchema from "~/models/ShippingTimeline";
import EmailHistorySchema from "~/models/EmailHistory";
// import SMSHistorySchema from "~/models/SMSHistory";
import ClientConnectionSchema from "~/models/ClientConnection";
import AddressSchema from "~/models/Address";
import WishListSchema from "~/models/WishList";
import NotificationSchema from "~/models/Notification";
import VisitSchema from "~/models/Visit";
import ClientDetailSchema from "~/models/ClientDetail";
import FeatureSchema from "~/models/Feature";
import SMSSchema from "~/models/SMS";
import GeneralSettingsSchema from "~/models/GeneralSettings";
import { PaymentApiSchema } from "./models/PaymentApi";
import SettingsBranchSchema from "./models/SettingsBranch";
import BranchSchema from "./models/Branch";
import PaymentSchema from "./models/PaymentDetails";
import SubscriptionHistorySchema from "./models/Subscription";
import PermissionSchema from "./models/Permission";

interface DomainDatabase {
  connection: Connection;
  models: Record<string, Model<Document>>;
  connectionDetails: {
    _id: string;
    plan: string;
    admin: string;
  };
}

let Admin: Model<Document>,
  Employee: Model<Document>,
  User: Model<Document>,
  Product: Model<Document>,
  Image: Model<Document>,
  Category: Model<Document>,
  Cart: Model<Document>,
  Order: Model<Document>,
  Address: Model<Document>,
  WishList: Model<Document>,
  // SMSHistory: Model<Document>,
  EmailHistory: Model<Document>,
  SMSSettings: Model<Document>,
  GeneralSettings: Model<Document>,
  ShippingTimeline: Model<Document>,
  NotificationSettings: Model<Document>,
  PaymentApi: Model<Document>,
  UserVisit: Model<Document>,
  StockHistory: Model<Document>,
  SettingsBranch: Model<Document>,
  Payment: Model<Document>,
  Branch: Model<Document>,
  GuestCart: Model<Document>,
  Permission: Model<Document>,
  Feature: Model<Document>, // main only
  ClientDetail: Model<Document>, //main only
  ClientConnection: Model<Document>, //main only
  SubscriptionHistory: Model<Document>; //main only

// Cache for storing domain database connections
const domainDbCache: Map<string, DomainDatabase> = new Map();

mongoose.connect(process.env.CENTRAL_DATABASE_URL as string);
const centralDb = mongoose.connection;
centralDb.on(
  "error",
  console.error.bind(console, "Central Database connection error:")
);
centralDb.once("open", () => {
  console.log("Connected to Central Database");
});

/** Fetch the domain details from the central database
 * @param domain The domain name string
 * @return databaseUri string
 */
const fetchDomainConnectionDetails = async (domain: string) => {
  try {
    const domainInfo = await centralDb
      .collection("client_connections")
      .findOne({ domain });

    if (!domainInfo) {
      console.log("Domain not found");
      throw new Error("Domain not found");
    }

    return domainInfo;
  } catch (error) {
    console.error("Error fetching domain connection details:", error);
    throw error;
  }
};

/** Establish connection to the appropriate database based on the domain
 * @param domain The domain name string
 */
const connectToDomainDatabase = async (domain: string) => {
  if (domain === process.env.CENTRAL_DOMAIN) {
    try {
      NotificationSettings = centralDb.model<Document>("notification_settings");
      SMSSettings = centralDb.model<Document>("sms_settings");
      // SMSHistory = centralDb.model<Document>("sms_history");
      EmailHistory = centralDb.model<Document>("email_history");
      Feature = centralDb.model<Document>("feature_requests");
      ClientConnection = centralDb.model<Document>("client_connections");
      ClientDetail = centralDb.model<Document>("client_details");
      UserVisit = centralDb.model<Document>("user_visits");
      PaymentApi = centralDb.model<Document>("payment_apis");
      GeneralSettings = centralDb.model<Document>("general_settings");
      SubscriptionHistory = centralDb.model<Document>("subscription_histories");
    } catch (error) {
      NotificationSettings = centralDb.model<Document>(
        "notification_settings",
        NotificationSchema
      );
      SMSSettings = centralDb.model<Document>("sms_settings", SMSSchema);
      // SMSHistory = centralDb.model<Document>("sms_history", SMSHistorySchema);
      EmailHistory = centralDb.model<Document>(
        "email_history",
        EmailHistorySchema
      );
      Feature = centralDb.model<Document>("feature_requests", FeatureSchema);
      ClientConnection = centralDb.model<Document>(
        "client_connections",
        ClientConnectionSchema
      );
      ClientDetail = centralDb.model<Document>(
        "client_details",
        ClientDetailSchema
      );
      UserVisit = centralDb.model<Document>("user_visits", VisitSchema);
      PaymentApi = centralDb.model<Document>("payment_apis", PaymentApiSchema);
      GeneralSettings = centralDb.model<Document>(
        "general_settings",
        GeneralSettingsSchema
      );
      SubscriptionHistory = centralDb.model<Document>(
        "subscription_histories",
        SubscriptionHistorySchema
      );
    }

    return {
      Feature,
      EmailHistory,
      ClientConnection,
      ClientDetail,
      UserVisit,
      PaymentApi,
      SubscriptionHistory,
    };
  } else {
    if (domainDbCache.has(domain)) {
      console.log(`Using cached connection to Domain Database for ${domain}`);
      const { connection, models, connectionDetails } = domainDbCache.get(
        domain
      ) as DomainDatabase;
      return { ...models, connection, connectionDetails };
    }

    const connectionDetails = await fetchDomainConnectionDetails(domain);
    const domainDb = mongoose.createConnection(connectionDetails.databaseUri, {
      maxPoolSize: 20,
    });

    domainDb.on(
      "error",
      console.error.bind(console, "Domain Database connection error:")
    );
    domainDb.once("open", () => {
      console.log(`Connected to Database for ${domain}`);
    });

    try {
      Admin = domainDb.model<Document>("admins");
      Employee = domainDb.model<Document>("employees");
      User = domainDb.model<Document>("users");
      Product = domainDb.model<Document>("products");
      Category = domainDb.model<Document>("categories");
      Image = domainDb.model<Document>("images");
      Order = domainDb.model<Document>("orders");
      Cart = domainDb.model<Document>("carts");
      GuestCart = domainDb.model<Document>("guest_carts");
      ShippingTimeline = domainDb.model<Document>("shipping_timelines");
      NotificationSettings = domainDb.model<Document>("notification_settings");
      SMSSettings = domainDb.model<Document>("sms_settings");
      WishList = domainDb.model<Document>("wishlistss");
      Address = domainDb.model<Document>("addresses");
      GeneralSettings = domainDb.model<Document>("general_settings");
      UserVisit = domainDb.model<Document>("user_visits");
      StockHistory = domainDb.model<Document>("stock_histories");
      SettingsBranch = domainDb.model<Document>("settings_branch");
      Branch = domainDb.model<Document>("branches");
      Payment = domainDb.model<Document>("payments");
      Permission = domainDb.model<Document>("permissions");
    } catch (error) {
      Admin = domainDb.model<Document>("admins", AdminSchema);
      Employee = domainDb.model<Document>("employees", EmployeeSchema);
      User = domainDb.model<Document>("users", UserSchema);
      Product = domainDb.model<Document>("products", ProductSchema);
      Category = domainDb.model<Document>("categories", CategorySchema);
      Image = domainDb.model<Document>("images", ImageSchema);
      Order = domainDb.model<Document>("orders", OrderSchema);
      Cart = domainDb.model<Document>("carts", CartSchema);
      GuestCart = domainDb.model<Document>("guest_carts", GuestCartSchema);
      ShippingTimeline = domainDb.model<Document>(
        "shipping_timelines",
        ShippingTimelineSchema
      );
      NotificationSettings = domainDb.model<Document>(
        "notification_settings",
        NotificationSchema
      );
      SMSSettings = domainDb.model<Document>("sms_settings", SMSSchema);
      WishList = domainDb.model<Document>("wishlistss", WishListSchema);
      Address = domainDb.model<Document>("addresses", AddressSchema);
      GeneralSettings = domainDb.model<Document>(
        "general_settings",
        GeneralSettingsSchema
      );
      UserVisit = domainDb.model<Document>("user_visits", VisitSchema);
      Payment = domainDb.model<Document>("payments", PaymentSchema);
      Branch = domainDb.model<Document>("branches", BranchSchema);
      StockHistory = domainDb.model<Document>(
        "stock_histories",
        StockHistorySchema
      );
      SettingsBranch = domainDb.model<Document>(
        "settings_branch",
        SettingsBranchSchema
      );
      Permission = domainDb.model<Document>("permissions", PermissionSchema);
    }

    // Cache the domain database connection
    const domainDatabase: DomainDatabase = {
      connectionDetails: connectionDetails,
      connection: domainDb,
      models: {
        Admin,
        Employee,
        User,
        Product,
        Order,
        Cart,
        GuestCart,
        Image,
        ShippingTimeline,
        Category,
        NotificationSettings,
        SMSSettings,
        WishList,
        Address,
        GeneralSettings,
        UserVisit,
        StockHistory,
        Payment,
        SettingsBranch,
        Branch,
        Permission,
      },
    };

    domainDbCache.set(domain, domainDatabase);

    return {
      ...domainDatabase.models,
      connection: domainDb,
      connectionDetails,
    };
  }
};

export {
  centralDb,
  fetchDomainConnectionDetails,
  connectToDomainDatabase,
  mongoose,
};
