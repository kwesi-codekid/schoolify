// import { type ActionFunction, type MetaFunction } from "@remix-run/node";
// import { Form } from "@remix-run/react";

// import { Input } from "~/components/ui/input";
// import { Button } from "~/components/ui/button";
// import ClientSetupController from "~/controllers/ClientSetupController";
// import { Label } from "~/components/ui/label";

// export default function SetupProfile() {
//   return (
//     <section className="w-1/2 mx-auto mt-11">
//       <p className="font-bold text-2xl mb-3">Store Information </p>

//       <Form method="POST" className="flex flex-col gap-3">
//         <div className="grid w-full items-center gap-1.5">
//           <Label htmlFor="name">Store Name</Label>
//           <Input id="name" name="name" type="text" />
//         </div>

//         <div className="grid w-full items-center gap-1.5">
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" name="email" type="email" />
//         </div>

//         <div className="grid w-full items-center gap-1.5">
//           <Label htmlFor="phone">Phone Number</Label>
//           <Input id="phone" name="phone" type="text" />
//         </div>

//         <Button type="submit" className="mt-2">
//           Proceed
//         </Button>
//       </Form>
//     </section>
//   );
// }

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();

//   let name = formData.get("name") as string;
//   let email = formData.get("email") as string;
//   let phone = formData.get("phone") as string;

//   const setupController = await new ClientSetupController(request);
//   return await setupController.createStore({ name, email, phone });
// };

// export const meta: MetaFunction = () => {
//   return [
//     { title: "ComClo - Setup Store" },
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
