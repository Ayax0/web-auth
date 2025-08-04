import * as argon2 from "argon2";
import z from "zod";

import { eq } from "drizzle-orm";
import { userDb } from "~~/server/db/schema";

const schema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await withAccessToken(event);
  if (!session)
    throw createError({ statusCode: 404, statusMessage: "session not found" });

  const user = await useDrizzle().query.userDb.findFirst({
    where: eq(userDb.id, session.user),
  });
  const body = await readValidatedBody(event, schema.parse);

  if (!user)
    throw createError({ statusCode: 404, statusMessage: "user not found" });
  if (!user.password)
    throw createError({ statusCode: 401, statusMessage: "not a local user" });

  if (!(await argon2.verify(user.password, body.old_password)))
    throw createError({ statusCode: 400, statusMessage: "schema mismatch" });

  await useDrizzle()
    .update(userDb)
    .set({ password: await argon2.hash(body.new_password) });
  return { status: "ok" };
});
