import {
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { Input, Button } from "@nextui-org/react";
import UploadFileInput from "~/components/custom/upload-file-input";
import ClientSetupController from "~/controllers/ClientSetupController";
import { validateEmail, validateFirstName } from "~/validators";

export default function SetupSchoolInfo() {
  const actionData = useActionData();
  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-4 md:gap-10 h-full">
      <div>
        <p className="font-nunito text-violet-500 mb-3">Step 2/3</p>
        <h2 className="font-bold font-montserrat dark:text-white text-slate-800 text-3xl md:text-5xl lg:text-6xl">
          Setup School Info
        </h2>
      </div>

      <Form
        method="post"
        className=" flex-1 flex flex-col md:pb-2 w-2/3 justify-between h-full"
        encType="multipart/form-data"
      >
        <div className="flex flex-col md:gap-6">
          <div className="w-full">
            <Input
              name="schoolName"
              label="School Name"
              required
              variant="underlined"
              className="font-nunito"
            />
          </div>

          <div className="w-full">
            <Input
              name="schoolEmail"
              label="School Email"
              type="email"
              required
              variant="underlined"
              className="font-nunito"
              isInvalid={actionData?.errors?.email ? true : false}
              errorMessage={actionData?.errors?.email}
            />
          </div>

          <div className="w-full">
            <Input
              name="contactNumber"
              label="Contact Number"
              type="tel"
              variant="underlined"
              className="font-nunito"
            />
          </div>

          <div className="w-full">
            <UploadFileInput name="schoolLogo" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="w-1/2 h-full font-montserrat md:text-lg"
            onClick={() => navigate("/setup/account_setup")}
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
            className="flex-1 h-11 font-montserrat md:text-lg bg-lightgreen hover:bg-lightgreen/80 text-slate-800"
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
  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "schoolLogo") {
        return undefined;
      }
      const buffer = [];
      for await (const chunk of data) {
        buffer.push(chunk);
      }
      const fileBuffer = Buffer.concat(buffer);
      const base64Data = fileBuffer.toString("base64");
      return `data:${contentType};base64,` + base64Data;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const name = formData.get("schoolName") as string;
  const email = formData.get("schoolEmail") as string;
  const phone = formData.get("contactNumber") as string;
  const schoolLogo = formData.get("schoolLogo") as string;

  // return true;
  const errors = {
    schoolName: validateFirstName(name),
    schoolEmail: validateEmail(email),
    schoolLogo: schoolLogo ? null : "School Logo is required",
    contactNumber: phone ? null : "Contact Number is required",
  };

  if (Object.values(errors).some(Boolean)) {
    console.log({ errors });
    return json({ errors }, { status: 400 });
  }

  const setupController = await new ClientSetupController(request);
  return await setupController.createSchool({ name, email, phone, schoolLogo });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Schoolify - Setup School" },
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
