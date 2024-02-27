// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  message: {
    title: string;
    description?: string;
    status: string;
  };
};

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("No session secret provided");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "flash__session",

      // all of these are optional
      // domain: "remix.run",
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 1,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
      secure: true,
    },
  });
const getFlashSession = getSession;
const commitFlashSession = commitSession;
const destroyFlashSession = destroySession;
export { getFlashSession, commitFlashSession, destroyFlashSession };
