import { eq } from "drizzle-orm";
import { sessionDb } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  const { refresh_token } = await withRefreshToken(event);

  deleteCookie(event, "access_token");
  deleteCookie(event, "refresh_token");
  await useDrizzle()
    .delete(sessionDb)
    .where(eq(sessionDb.token, refresh_token));

  return { status: "ok" };
});
