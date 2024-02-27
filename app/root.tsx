import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { commitFlashSession, getFlashSession } from "./flash-session";
import { useToast } from "./components/use-toast";
import { useEffect } from "react";
import moment from "moment";
import { Toaster } from "~/components/toaster";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  const { message } = useLoaderData<typeof loader>();
  const { toast } = useToast();
  useEffect(() => {
    // if (message) {
    console.log("run toast");

    toast({
      title: "message.title",
      description: `${moment().format("dddd, MMMM D, YYYY [at] h:mm A")}`,
      variant: false ? "destructive" : "default",
    });
    // }
  }, [message]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Outlet />
            <Toaster />

            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getFlashSession(request.headers.get("Cookie"));
  const message = session.get("message") || null;

  return json(
    { message },
    {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    }
  );
}
