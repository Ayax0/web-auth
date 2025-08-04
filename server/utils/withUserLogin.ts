import type { H3Event } from "h3";

import { verify } from "argon2";

import { eq } from "drizzle-orm";
import { userDb } from "../db/schema";

export default async function (event: H3Event) {
  const authorization = getHeader(event, "Authorization");
  const match = authorization?.match(/^Basic ([A-Za-z0-9\\+=]+)$/);

  if (!match || !match[1])
    throw createError({ statusCode: 401, statusMessage: "missing auth" });

  const [username, password] = Buffer.from(match[1], "base64")
    .toString("utf-8")
    .split(":");

  if (!username || !password)
    throw createError({ statusCode: 401, statusMessage: "missing auth" });

  const user = await useDrizzle().query.userDb.findFirst({
    where: eq(userDb.username, username),
    with: { profile: true },
  });

  if (!user?.password)
    throw createError({ statusCode: 401, statusMessage: "not a local user" });

  if (!user || !(await verify(user.password, password)))
    throw createError({
      statusCode: 403,
      statusMessage: "verification failed",
    });

  return user;
}
