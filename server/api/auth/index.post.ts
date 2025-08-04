import jwt from "jsonwebtoken";
import { sessionDb } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  const user = await withUserLogin(event);
  const agent = getHeader(event, "user-agent");

  const config = useRuntimeConfig();
  const expiresIn = parseInt(config.public.refreshTokenTimeout || "0");

  const token = jwt.sign({ user: user.id }, config.tokenSecret, {
    expiresIn,
  });

  await useDrizzle().insert(sessionDb).values({
    user: user.id,
    token,
    agent,
    last_login: new Date(),
  });

  setCookie(event, "refresh_token", token, {
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/api/auth",
  });

  return { status: "ok" };
});
