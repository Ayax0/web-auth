import { eq } from "drizzle-orm";
import z from "zod";
import { profileDb } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  await withAccessToken(event);

  const { profileId } = await getValidatedRouterParams(
    event,
    z.object({ profileId: z.int() }).parse
  );

  return useDrizzle().query.profileDb.findFirst({
    where: eq(profileDb.id, profileId),
  });
});
