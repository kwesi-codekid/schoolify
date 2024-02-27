// import {
//   type MetaFunction,
//   type ActionFunction,
//   json,
//   type LoaderFunction,
// } from "@remix-run/node";
// import { Form, useActionData, useLoaderData } from "@remix-run/react";
// import { useState } from "react";
// import { Input } from "~/components/ui/input";
// import { Button } from "~/components/ui/button";
// import IdGenerator from "~/lib/IdGenerator";
// import ClientSetupController from "~/controllers/ClientSetupController";

// export default function SetupProfile() {
//   const { storeDetails } = useLoaderData();
//   const data = useActionData();
//   const [domain, setDomain] = useState(
//     `${storeDetails?.storeName.replaceAll(" ", "").trim()}.printmoney.money`
//       .replaceAll(" ", "")
//       .replaceAll("  ", "")
//       .trim()
//       .toLowerCase()
//   );

//   return (
//     <section className="w-1/2 mx-auto mt-11">
//       <p className="font-bold text-2xl mb-3">Custom Domain </p>

//       <p className="mb-2 text-red-500">
//         If you already have a domain, enter it in the field below. If not leave
//         the field as it is
//       </p>
//       <Form method="POST" className="flex flex-col gap-3">
//         <Input
//           name="domain"
//           placeholder="Domain"
//           label="Domain"
//           type="text"
//           error={data?.errors?.domain}
//           onChange={(e) => setDomain(e.target.value)}
//           defaultValue={domain}
//         />

//         {/* if domain doesnt contain .comclo.com, then display form for your to enter dns entrires */}

//         <Button type="submit" className="mt-2">
//           Complete Sign Up
//         </Button>
//       </Form>
//     </section>
//   );
// }

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const domain = formData.get("domain") as string;
//   const database = (formData.get("domain") as string).split(".")[0];

//   if (typeof domain !== "string" || typeof database !== "string") {
//     return json({ error: "Invalid domain or database" }, { status: 400 });
//   }

//   const setupController = await new ClientSetupController(request);
//   return await setupController.storeDomain({
//     domain,
//     database: `comclo_${database}_${IdGenerator(5)}`,
//   });
// };

// export const loader: LoaderFunction = async ({ request }) => {
//   const setupController = await new ClientSetupController(request);
//   const storeDetails = await setupController.getStore();

//   return { storeDetails };
// };

// export const meta: MetaFunction = () => {
//   return [
//     { title: "ComClo - Setup Domain & Database" },
//     {
//       name: "description",
//       content: "The best e-Commerce platform for your business.",
//     },
//     { name: "og:title", content: "ComClo" },
//     { property: "og:type", content: "websites" },
//     {
//       name: "og:description",
//       content: "The best e-Commerce platform for your business.",
//     },
//     {
//       name: "og:image",
//       content:
//         "https://res.cloudinary.com/app-deity/image/upload/v1700242905/l843bauo5zpierh3noug.png",
//     },
//     { name: "og:url", content: "https://single-ecommerce.vercel.app" },
//   ];
// };
