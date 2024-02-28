import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
// import logo from "~/assets/logo.png";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { BackgroundBeams } from "~/components/ui/background-beams";
import { Button } from "@nextui-org/react";

export default function AccountSetup() {
  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-slate-950 py-5 pb-16">
      <section className="relative z-[10] max-w-5xl mx-auto flex items-center justify-end px-4">
        <ThemeSwitcher />
      </section>

      <section className="flex-1 max-w-5xl mx-auto h-full flex flex-col md:flex-row md:gap-8 p-5">
        <div className="flex-1 h-full rounded-2xl bg-lightgreen/30 hidden md:flex"></div>

        <div className="w-full md:w-1/2 h-full relative z-10">
          <Outlet />
        </div>
      </section>
      <BackgroundBeams className="" />
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  return {};
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Setup" },
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
