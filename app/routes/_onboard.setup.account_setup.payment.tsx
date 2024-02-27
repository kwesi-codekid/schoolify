// import { type MetaFunction, type ActionFunction } from "@remix-run/node";

// import { Input } from "~/components/ui/input";
// import { Button } from "~/components/ui/button";
// import ClientSetupController from "~/controllers/ClientSetupController";

// export default function SetupProfile() {
//   return (
//     <section className="w-1/2 mx-auto mt-11">
//       <p className="font-bold text-2xl mb-3">Payment Setup </p>

//       <p>payment setup</p>

//       <Button type="submit" className="mt-2">
//         Proceed
//       </Button>
//     </section>
//   );
// }

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();

//   return true;

//   // let domain = formData.get("domain") as string;
//   // let database = (formData.get("domain") as string).split(".")[0];

//   // if (typeof domain !== "string" || typeof database !== "string") {
//   //   return json({ error: "Invalid domain or database" }, { status: 400 });
//   // }

//   // const errors = {
//   //   domain: validateName(domain),
//   // };

//   // if (Object.values(errors).some(Boolean)) {
//   //   return json({ errors, fields: { domain, database } }, { status: 400 });
//   // }

//   // return await createDbConnection(domain, database, request);
// };

// export const meta: MetaFunction = () => {
//   return [
//     { title: "ComClo - Setup" },
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
