import { sessionDb } from "~~/server/db/schema";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const user = await withAzureLogin(event);
  const agent = getHeader(event, "user-agent");

  const config = useRuntimeConfig();
  const secret = config.tokenSecret;
  const timeout = parseInt(config.public.refreshTokenTimeout || "0");

  const token = jwt.sign({ user: user.id }, secret, {
    expiresIn: Number(timeout),
  });

  await useDrizzle().insert(sessionDb).values({
    user: user.id,
    last_login: new Date(),
    token,
    agent,
  });

  setCookie(event, "refresh_token", token, {
    expires: new Date(Date.now() + timeout),
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/api/auth",
  });

  return { status: "ok" };
});
