import { eq } from "drizzle-orm";
import z from "zod";
import { profileDb } from "~~/server/db/schema";

const schema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const session = await withAccessToken(event);
  if (!session)
    throw createError({ statusCode: 404, statusMessage: "session not found" });

  const body = await readValidatedBody(event, schema.parse);

  await useDrizzle()
    .update(profileDb)
    .set(body)
    .where(eq(profileDb.user, session.user));

  return { status: "ok" };
});
