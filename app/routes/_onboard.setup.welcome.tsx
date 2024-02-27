// import React from "react";
// import { Link } from "@remix-run/react";
// import { type MetaFunction } from "@remix-run/node";
// // import logo from "~/assets/logo.png";

// export default function OnboardWelcome() {
//   return (
//     <div className="flex min-h-screen w-full items-center justify-center flex-col bg-slate-100/90 dark:bg-slate-900 dark:text-white">
//       <section className="w-5/6 mx-auto flex flex-col">
//         <img src={logo} alt="" className="w-48 mx-auto" />

//         <h1 className="text-6xl font-bold text-center">
//           Welcome to{" "}
//           <span className="gradient-text backdrop-blur-lg opacity-90">
//             ComClo
//           </span>
//         </h1>
//         <p className="mt-11 text-center text-base font-medium">
//           We're thrilled to have you onboard! ComClo is your all-in-one solution
//           for e-commerce success.
//         </p>
//         <p className=" text-center text-base font-medium">
//           Let get started on your journey to seamless online retail.
//         </p>
//         <Link
//           to="/setup/account_setup"
//           className="inline-block px-4 py-2 mt-11 mx-auto text-white font-semibold rounded-xl shadow-md hover:shadow-sm hover:shadow-black/70 hover:bg-primary/90 bg-gradient-to-tr from-purple-700 to-orange-600 transition-all duration-300"
//         >
//           Setup my Account
//         </Link>
//       </section>
//     </div>
//   );
// }

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
