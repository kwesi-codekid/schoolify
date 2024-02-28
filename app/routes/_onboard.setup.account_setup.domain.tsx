import {
  redirect,
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunction,
  type MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import UploadFileInput from "~/components/custom/upload-file-input";
import ClientSetupController from "~/controllers/ClientSetupController";
import { validateEmail, validateFirstName } from "~/validators";
import { useState } from "react";
import IdGenerator from "~/IdGenerator";

export default function SetupDomain() {
  const actionData = useActionData();
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);
  return (
    <section className="flex flex-col gap-4 md:gap-10 h-full">
      <div>
        <p className="font-nunito text-violet-500 mb-3">Step 3/3</p>
        <h2 className="font-bold font-montserrat dark:text-white text-slate-800 text-3xl md:text-5xl lg:text-6xl">
          Setup Domain Name
        </h2>
      </div>

      <Form
        method="post"
        className=" flex-1 flex flex-col md:pb-2 w-full md:w-2/3 gap-16 md:gap-0 md:justify-between h-full"
      >
        <div className="flex flex-col gap-6 md:gap-6">
          <div className="w-full">
            <Input
              name="domainName"
              label="Domain Name"
              required
              variant="underlined"
              className={`"font-nunito" ${isSelected ? "hidden" : "block"}`}
              isInvalid={actionData?.errors?.domainName ? true : false}
              errorMessage={actionData?.errors?.domainName}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small font-nunito">
                    .schoolify.com
                  </span>
                </div>
              }
            />
          </div>

          <div className="w-full">
            <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
              I already have a custom domain
            </Checkbox>

            <Input
              name="customName"
              label="Custom Domain Name"
              required
              variant="underlined"
              className={`"font-nunito" ${isSelected ? "block" : "hidden"}`}
              isInvalid={actionData?.errors?.customDomain ? true : false}
              errorMessage={actionData?.errors?.customDomain}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="w-1/2 h-full font-montserrat md:text-lg"
            onClick={() => navigate("/setup/account_setup/school-info")}
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            }
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 font-montserrat md:text-lg bg-lightgreen hover:bg-lightgreen/80 text-slate-800 font-semibold"
            variant="flat"
          >
            Continue
          </Button>
        </div>
      </Form>
    </section>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const domainName = formData.get("domainName") as string;
  const customName = formData.get("customName") as string;
  const database = domainName.split(".")[0];

  if (typeof domainName !== "string" || typeof database !== "string") {
    return json({ error: "Invalid domain or database" }, { status: 400 });
  }

  console.log({
    domain: customName ? customName : domainName + ".schoolify.com",
    database: `${database}_${IdGenerator(7)}`,
  });

  //   return true;
  const setupController = await new ClientSetupController(request);
  return await setupController.storeSchoolDomain({
    domain: customName ? customName : domainName + ".schoolify.com",
    database: `${database}_${IdGenerator(5)}`,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const setupController = await new ClientSetupController(request);
  const storeDetails = await setupController.getStore();

  return { storeDetails };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Schollify - Setup Domain" },
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
