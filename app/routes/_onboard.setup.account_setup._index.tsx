import {
  json,
  type ActionFunction,
  type MetaFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Input, Button } from "@nextui-org/react";

import ClientSetupController from "~/controllers/ClientSetupController";
import {
  validateEmail,
  validatePassword,
  confirmPassword,
  validateFirstName,
} from "~/validators";

export default function SetupProfile() {
  const actionData = useActionData();

  return (
    <section className="flex flex-col gap-4 md:gap-10 h-full">
      <div>
        <p className="font-nunito text-violet-500 mb-3">Step 1/3</p>
        <h2 className="font-bold font-montserrat dark:text-white text-slate-800 text-3xl md:text-5xl lg:text-6xl">
          User Account Setup
        </h2>
      </div>

      <Form
        method="post"
        className=" flex-1 flex flex-col md:pb-10 justify-between h-full"
      >
        <div className="flex flex-col md:gap-10">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Input
              name="firstName"
              label="First Name"
              required
              variant="underlined"
              className="font-nunito"
            />
            <Input
              name="lastName"
              label="Last Name"
              required
              variant="underlined"
              className="font-nunito"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Input
              name="email"
              label="Email"
              type="email"
              required
              variant="underlined"
              className="font-nunito"
              isInvalid={actionData?.errors?.email ? true : false}
              errorMessage={actionData?.errors?.email}
            />
            <Input
              name="phone"
              label="Phone"
              type="tel"
              variant="underlined"
              className="font-nunito"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Input
              name="password"
              label="Password"
              type="password"
              required
              variant="underlined"
              className="font-nunito"
              isInvalid={actionData?.errors?.password ? true : false}
              errorMessage={actionData?.errors?.password}
            />
            <Input
              name="confrimPassword"
              label="Confirm Password"
              type="password"
              required
              variant="underlined"
              className="font-nunito"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="h-12 font-montserrat md:text-lg w-1/2 bg-lightgreen hover:bg-lightgreen/80 text-slate-800"
          variant="flat"
        >
          Continue
        </Button>
      </Form>
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
    { title: "Schoolify - Setup Account" },
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
