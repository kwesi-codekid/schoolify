// import React from "react";
// import { Link, useLoaderData } from "@remix-run/react";
// import { type LoaderFunction, type MetaFunction } from "@remix-run/node";
// import logo from "~/assets/logo.png";
// import ClientSetupController from "~/controllers/ClientSetupController";

// export default function Congratulation() {
//   const { admin, connectionInfo } = useLoaderData();

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center flex-col bg-slate-100/90 dark:bg-slate-900 dark:text-white">
//       <section className="w-5/6 mx-auto flex flex-col">
//         <img src={logo} alt="" className="w-48 mx-auto" />

//         <h1 className="gradient-text backdrop-blur-lg opacity-90 text-6xl font-bold text-center">
//           Congratulations!
//         </h1>
//         <p className="mt-11 text-center text-base font-medium">
//           You've successfully completed the setup process. Welcome to ComClo's
//           family of e-commerce experts!
//         </p>

//         <p className="text-center text-base font-medium">
//           The domian configuration is propagating. You will be notified when
//           your dashboard is ready. This can take up to 24 hours
//         </p>

//         <p className="text-center text-base font-medium">
//           You can access your site at :{" "}
//           <span className="text-purple-600">{connectionInfo.domain}</span>,{" "}
//           after the propergation
//         </p>
//         <Link
//           to="/"
//           className="inline-block px-4 py-2 mt-11 mx-auto text-white font-semibold rounded-xl shadow-md hover:shadow-sm hover:shadow-black/70 hover:bg-primary/90 bg-gradient-to-tr from-purple-700 to-orange-600 transition-all duration-300"
//         >
//           Go back Home
//         </Link>
//       </section>
//     </div>
//   );
// }

// export const loader: LoaderFunction = async ({ request, params }) => {
//   const { id } = params;
//   const setupController = await new ClientSetupController(request);
//   const { admin, connectionInfo } = await setupController.getCompleteSetup(
//     id as string
//   );
//   return { admin, connectionInfo };
// };

// export const meta: MetaFunction = () => {
//   return [
//     { title: "ComClo - Congratulations" },
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
