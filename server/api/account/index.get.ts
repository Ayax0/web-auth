import { eq } from "drizzle-orm";
import { profileDb } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  const { user } = await withAccessToken(event);
  const [account] = await useDrizzle()
    .select()
    .from(profileDb)
    .where(eq(profileDb.user, user));
  return account;
});
