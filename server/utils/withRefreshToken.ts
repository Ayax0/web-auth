import type { H3Event } from "h3";

import jwt from "jsonwebtoken";

import { sessionDb, userDb } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function (event: H3Event) {
  const config = useRuntimeConfig();
  const refresh_token = getCookie(event, "refresh_token");

  if (!refresh_token)
    throw createError({
      statusCode: 401,
      statusMessage: "missing refresh_token",
    });

  try {
    jwt.verify(refresh_token, config.tokenSecret);

    const [session] = await useDrizzle()
      .update(sessionDb)
      .set({ last_login: new Date() })
      .where(eq(sessionDb.token, refresh_token))
      .returning({ user: sessionDb.user });

    if (!session || !session.user)
      throw createError({
        statusCode: 403,
        statusMessage: "invalide refresh_token",
      });

    const user = await useDrizzle().query.userDb.findFirst({
      where: eq(userDb.id, session.user),
      with: { profile: true },
    });

    if (!user)
      throw createError({
        statusCode: 403,
        statusMessage: "invalide refresh_token",
      });

    return { user, refresh_token };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    deleteCookie(event, "refresh_token");
    await useDrizzle()
      .delete(sessionDb)
      .where(eq(sessionDb.token, refresh_token));
    throw createError({
      statusCode: 403,
      statusMessage: "invalide refresh_token",
    });
  }
}
