import React from "react";
import { Link } from "@remix-run/react";
import { type MetaFunction } from "@remix-run/node";
import illustration from "~/assets/svgs/dashboard-screens.svg";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { Button } from "@nextui-org/react";

export default function OnboardWelcome() {
  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-slate-950 md:py-4 py-1">
      <section className="max-w-5xl mx-auto flex items-center justify-end px-4">
        <ThemeSwitcher btnSize="md" />
      </section>

      <section className="h-full flex flex-col-reverse md:flex-row items-center gap-1 max-w-9xl mx-auto px-4 md:px-36 pt-3 md:pt-8 pb-32 md:pb-16">
        <div className="w-full md:w-1/2 h-full flex flex-col justify-between py-4 md:py-8">
          <div>
            <h3 className="dark:text-white font-montserrat text-xl md:text-3xl text-slate-800 font-bold mb-2">
              Welcome to{" "}
            </h3>
            <h1 className="font-extrabold text-6xl md:text-8xl bg-clip-text font-montserrat pb-5 text-transparent bg-gradient-to-br from-deepgreen via-lightgreen to-deepgreen">
              Schoolify
            </h1>
            <p className="font-nunito text-sm text-slate-500 dark:text-violet-500">
              Seamless tools for effective school management.
            </p>
          </div>

          <div>
            <Link to="/setup/account_setup">
              <Button
                className="hover:!bg-lightgreen hover:!text-black dark:!text-lightgreen !text-slate-800 !border-lightgreen font-montserrat font-medium"
                variant="ghost"
                size="lg"
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex w-full justify-center flex-1 h-full">
          <img
            src={illustration}
            className="size-[12rem] md:size-full"
            alt="illustration"
          />
        </div>
      </section>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "Schoolify - Setup" },
    {
      name: "description",
      content: "Seamless tools for effective school management.",
    },
    { name: "og:title", content: "ComClo" },
    { property: "og:type", content: "websites" },
    {
      name: "og:description",
      content: "Seamless tools for effective school management.",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1700242905/l843bauo5zpierh3noug.png",
    },
    { name: "og:url", content: "https://single-ecommerce.vercel.app" },
  ];
};
