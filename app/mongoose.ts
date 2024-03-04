import mongoose, { type Document, type Model, type Connection } from "mongoose";
import AdminSchema from "~/models/Admin";
import StudentSchema from "~/models/User";
import EmailHistorySchema from "~/models/EmailHistory";
// import SMSHistorySchema from "~/models/SMSHistory";
import ClientConnectionSchema from "~/models/ClientConnection";
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
import TeacherSchema from "./models/Teacher";
import FeeSchema from "./models/Fee";
import ClassSchema from "./models/Class";
import FeeStructureSchema from "./models/FeeStructure";
import SubjectSchema from "./models/Subject";
import ParentSchema from "./models/Parent";

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
  // ----------------- Main Database Models -----------------
  Teacher: Model<Document>,
  Student: Model<Document>,
  Fee: Model<Document>,
  FeeStructure: Model<Document>,
  StudentClass: Model<Document>,
  Subject: Model<Document>,
  Parent: Model<Document>,
  //  ----------------- Other Models -----------------
  EmailHistory: Model<Document>,
  SMSSettings: Model<Document>,
  GeneralSettings: Model<Document>,
  NotificationSettings: Model<Document>,
  PaymentApi: Model<Document>,
  UserVisit: Model<Document>,
  SettingsBranch: Model<Document>,
  Payment: Model<Document>,
  Branch: Model<Document>,
  Permission: Model<Document>,
  // ----------------- Central Database Models -----------------
  Feature: Model<Document>,
  ClientDetail: Model<Document>,
  ClientConnection: Model<Document>,
  SubscriptionHistory: Model<Document>;

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
      SMSSettings = centralDb.model<Document>("sms_settings");
      // SMSHistory = centralDb.model<Document>("sms_history");
      EmailHistory = centralDb.model<Document>("email_history");
      Feature = centralDb.model<Document>("feature_requests");
      ClientConnection = centralDb.model<Document>("client_connections");
      ClientDetail = centralDb.model<Document>("client_details");
      PaymentApi = centralDb.model<Document>("payment_apis");
      GeneralSettings = centralDb.model<Document>("general_settings");
      SubscriptionHistory = centralDb.model<Document>("subscription_histories");
    } catch (error) {
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

      Teacher = domainDb.model<Document>("teachers");
      Student = domainDb.model<Document>("students");
      Fee = domainDb.model<Document>("fees");
      StudentClass = domainDb.model<Document>("classes");
      FeeStructure = domainDb.model<Document>("fee_structures");
      Subject = domainDb.model<Document>("subjects");
      Parent = domainDb.model<Document>("parents");

      NotificationSettings = domainDb.model<Document>("notification_settings");
      SMSSettings = domainDb.model<Document>("sms_settings");
      GeneralSettings = domainDb.model<Document>("general_settings");
      UserVisit = domainDb.model<Document>("user_visits");
      SettingsBranch = domainDb.model<Document>("settings_branch");
      Branch = domainDb.model<Document>("branches");
      Payment = domainDb.model<Document>("payments");
      Permission = domainDb.model<Document>("permissions");
    } catch (error) {
      Admin = domainDb.model<Document>("admins", AdminSchema);

      Teacher = domainDb.model<Document>("teachers", TeacherSchema);
      Student = domainDb.model<Document>("students", StudentSchema);
      Fee = domainDb.model<Document>("fees", FeeSchema);
      StudentClass = domainDb.model<Document>("classes", ClassSchema);
      FeeStructure = domainDb.model<Document>(
        "fee_structures",
        FeeStructureSchema
      );
      Subject = domainDb.model<Document>("subjects", SubjectSchema);
      Parent = domainDb.model<Document>("parents", ParentSchema);

      NotificationSettings = domainDb.model<Document>(
        "notification_settings",
        NotificationSchema
      );
      SMSSettings = domainDb.model<Document>("sms_settings", SMSSchema);
      GeneralSettings = domainDb.model<Document>(
        "general_settings",
        GeneralSettingsSchema
      );
      UserVisit = domainDb.model<Document>("user_visits", VisitSchema);
      Payment = domainDb.model<Document>("payments", PaymentSchema);
      Branch = domainDb.model<Document>("branches", BranchSchema);
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
        Teacher,
        Student,
        Parent,
        StudentClass,
        Fee,
        FeeStructure,
        Subject,
        NotificationSettings,
        SMSSettings,
        GeneralSettings,
        UserVisit,
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
