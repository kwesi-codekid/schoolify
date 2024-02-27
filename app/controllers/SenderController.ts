import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "~/mongoose";
import { type ObjectId } from "mongoose";
import nodemailer from "nodemailer";

export default class SenderController {
  private request: Request;
  private domain: string;
  private session: any;
  private storage: SessionStorage;
  private SMSHistory: any;
  private EmailHistory: any;
  private connectionDetails: {
    databaseUri: string;
    username: string;
    password: string;
    _id: ObjectId;
    admin: string;
    storeName: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  private transporter = nodemailer.createTransport({
    host: "server1.medsov.com",
    port: 465,
    auth: {
      user: "isupport@medsov.com",
      pass: "10^6$tobegin",
    },
    debug: true,
    logger: true,
  });

  /**
   * Initialize a SenderController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });

    return (async (): Promise<SenderController> => {
      await this.initializeModels();
      return this;
    })() as unknown as SenderController;
  }

  private async initializeModels() {
    const { SMSHistory, EmailHistory, connectionDetails } =
      await connectToDomainDatabase(this.domain);

    this.SMSHistory = SMSHistory;
    this.EmailHistory = EmailHistory;
    this.connectionDetails = connectionDetails;
  }

  /**
   * Create new sms record
   * @param params name
   */
  public createSMS = async ({
    subject,
    body,
  }: {
    subject: string;
    body: string;
  }) => {
    const storeDetails = this.connectionDetails;
    // const session = await this.storage.getSession(
    //   this.request.headers.get("Cookie")
    // );
    // const client_details = session.get("store_details");

    const feature = await this.SMSHistory.create({
      from: storeDetails?.phone,
      to: "asfa",
      body,
      storeId: storeDetails?._id,
      status: "NEW",
    });

    return feature;
  };

  /**
   * Create new email record
   * @param params name
   */
  public createEmail = async ({
    subject,
    body,
  }: {
    subject: string;
    body: string;
  }) => {
    const userController = await new UserController(this.request);
    const user = await userController.getUser();
    const storeDetails = this.connectionDetails;
    // const session = await this.storage.getSession(
    //   this.request.headers.get("Cookie")
    // );
    // const client_details = session.get("store_details");

    const feature = await this.EmailHistory.create({
      from: storeDetails.email,
      to: user?.email,
      subject,
      body: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
              /* Add your CSS styles here */
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
      
              .container {
                  max-width: 600px;
                  margin: 50px auto;
                  padding: 20px;
                  background-color: #ffffff;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
              }
      
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
      
              .header img {
                  max-width: 100px;
              }
      
              .message {
                  padding: 20px;
                  background-color: #f0f0f0;
                  border-radius: 5px;
              }
      
              .message h2 {
                  color: #333;
                  font-size: 24px;
                  margin: 0;
              }
      
              .message p {
                  color: #555;
                  font-size: 16px;
              }
      
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #888;
              }
      
              .footer p {
                  margin: 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://your-company.com/logo.png" alt="Company Logo">
                  <h1>Your Company Name</h1>
              </div>
              <div class="message">
                  <h2>Order Confirmation</h2>
                  <p>Dear [Customer Name],</p>
                  <p>Your order #[Order Number] has been successfully processed.</p>
                  <p>Order Details:</p>
                  <ul>
                      <li>Product: [Product Name]</li>
                      <li>Quantity: [Quantity]</li>
                      <li>Total Price: $[Total Price]</li>
                  </ul>
                  <p>Thank you for shopping with us. We look forward to serving you again in the future.</p>
              </div>
              <div class="footer">
                  <p>© 2023 Your Company Name</p>
                  <p>Contact us at support@your-company.com</p>
              </div>
          </div>
      </body>
      </html>`,
      storeId: storeDetails?._id,
    });

    return feature;
  };

  public sendBatchSMS = async ({
    _id,
    user,
    title,
    description,
    request_type,
  }: {
    _id: string;
    user: string;
    title: string;
    description: string;
    request_type: string;
  }) => {
    try {
      await this.SMSHistory.findOneAndUpdate(
        { _id, user },
        {
          title,
          description,
          request_type,
        }
      );
      return redirect(`/console/feature-requests`);
    } catch (error) {
      return json(
        {
          status: "error",
          message: "You can't update this request!",
        },
        { status: 400 }
      );
    }
  };

  public sendSingleSMS = async () => {
    return json({ message: "Success" }, 200);
  };

  public sendBatchEmail = async () => {
    const mailOptions = {
      from: '"shop name" <isupport@medsov.com>',
      to: '"customer name" <stanleyotabil10@gmail.com>',
      subject: "Hello from ComClo",
      text: "For clients with plaintext support only",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
              /* Add your CSS styles here */
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
              }
      
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
      
              .header img {
                  max-width: 100px;
              }
      
              .message {
                  padding: 20px;
                  background-color: #f0f0f0;
                  border-radius: 5px;
              }
      
              .message h2 {
                  color: #333;
                  font-size: 24px;
                  margin: 0;
              }
      
              .message p {
                  color: #555;
                  font-size: 16px;
              }
      
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #888;
              }
      
              .footer p {
                  margin: 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://your-company.com/logo.png" alt="Company Logo">
                  <h1>Your Company Name</h1>
              </div>
              <div class="message">
                  <h2>Order Confirmation</h2>
                  <p>Dear [Customer Name],</p>
                  <p>Your order #[Order Number] has been successfully processed.</p>
                  <p>Order Details:</p>
                  <ul>
                      <li>Product: [Product Name]</li>
                      <li>Quantity: [Quantity]</li>
                      <li>Total Price: $[Total Price]</li>
                  </ul>
                  <p>Thank you for shopping with us. We look forward to serving you again in the future.</p>
              </div>
              <div class="footer">
                  <p>© 2023 Your Company Name</p>
                  <p>Contact us at support@your-company.com</p>
              </div>
          </div>
      </body>
      </html>
      `,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        return json({ message: "Success", info: info.response }, 200);
      }
    });

    return json({ message: "Success" }, 200);
  };

  public sendEmail = async ({
    subject,
    body,
    to,
    from,
  }: {
    subject: string;
    body: string;
    to: string;
    from: string;
  }) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: "For clients with plaintext support only",
      html: body,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return json({ message: "Success", error }, 200);
      } else {
        return json({ message: "Success", info: info.response }, 200);
      }
    });

    return json({ message: "Success" }, 200);
  };
}

let orderstatus = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        /* Add your CSS styles here */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            max-width: 100px;
        }

        .message {
            padding: 20px;
        }

        .message h2 {
            color: #333;
            font-size: 24px;
            margin: 0;
        }

        .message p {
            color: #555;
            font-size: 16px;
        }

        .button {
            text-align: center;
            margin-top: 20px;
        }

        .button a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://your-company.com/logo.png" alt="Company Logo">
            <h1>Order Status Update</h1>
        </div>
        <div class="message">
            <h2>Hello [Customer Name],</h2>
            <p>We are writing to inform you about the latest update on your order #[Order Number].</p>
            <p>Order Details:</p>
            <ul>
                <li>Product: [Product Name]</li>
                <li>Quantity: [Quantity]</li>
                <li>Total Price: $[Total Price]</li>
            </ul>
            <p>Order Status: [New Order Status]</p>
            <p>This change in status may indicate that your order has been processed, shipped, delivered, or any other relevant update.</p>
            <p>If you have any questions or concerns about your order, please don't hesitate to contact our support team.</p>
        </div>
        <div class="button">
            <a href="https://your-company.com/order-status" target="_blank">View Order Details</a>
        </div>
    </div>
</body>
</html>
`;
