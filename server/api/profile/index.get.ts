import { profileDb } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  await withAccessToken(event);

  return useDrizzle().select().from(profileDb);
});
