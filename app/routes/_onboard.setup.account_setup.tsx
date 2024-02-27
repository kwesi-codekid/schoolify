// import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
// import { Outlet } from "@remix-run/react";
// import logo from "~/assets/logo.png";

// export default function AccountSetup() {
//   return (
//     <div className="flex min-h-screen w-full items-center py-36 flex-col bg-slate-100/90 dark:bg-slate-900 dark:text-white">
//       <section className="w-1/2 mx-auto">
//         <img src={logo} alt="" className="w-20" />

//         <h3 className="mx-auto text-4xl font-bold ">Set Up your Account</h3>

//         <p className="mt-3 text-base font-medium">
//           It's time to configure your account to tailor ComClo to your specific
//           needs. We'll guide you through the process step by step.
//         </p>
//       </section>

//       <Outlet />
//     </div>
//   );
// }

// export const loader: LoaderFunction = async ({ request }) => {
//   return {};
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
