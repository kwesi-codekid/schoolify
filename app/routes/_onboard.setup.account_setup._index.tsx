import {
  json,
  type ActionFunction,
  type MetaFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";

import ClientSetupController from "~/controllers/ClientSetupController";
import {
  validateEmail,
  validatePassword,
  confirmPassword,
  validateFirstName,
} from "~/validators";

export default function SetupProfile() {
  return (
    <section className="w-1/2 mx-auto">
      <p className="font-bold text-2xl mb-3">User Profile</p>

      {/* <Form method="POST" className="flex flex-col gap-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="username">Your Name</Label>
          <Input id="username" name="username" type="text" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="text" />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>

        <Button type="submit" className="mt-2">
          Proceed
        </Button>
      </Form> */}
    </section>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPasswordd = formData.get("confirmPassword") as string;

  const errors = {
    firstName: validateFirstName(firstName),
    lastName: validateFirstName(lastName),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: confirmPassword(password, confirmPasswordd),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors }, { status: 400 });
  }

  const setupController = await new ClientSetupController(request);
  return await setupController.createProfile({
    firstName,
    lastName,
    email,
    phone,
    password,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return true;
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Setup Account" },
    {
      name: "description",
      content: "The best e-Commerce platform for your business.",
    },
    { name: "og:title", content: "ComClo" },
    { property: "og:type", content: "websites" },
    {
      name: "og:description",
      content: "The best e-Commerce platform for your business.",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1700242905/l843bauo5zpierh3noug.png",
    },
    { name: "og:url", content: "https://single-ecommerce.vercel.app" },
  ];
};
