import { hash } from "argon2";
import { schema } from "~~/shared/schema/register";
import { profileDb, userDb } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse);

  const users = await useDrizzle()
    .select({ id: userDb.id })
    .from(userDb)
    .where(eq(userDb.username, body.username))
    .limit(1);

  if (users.length > 0)
    throw createError({
      statusCode: 409,
      statusMessage: "username already exists",
    });

  await useDrizzle().transaction(async (tx) => {
    const [user] = await tx
      .insert(userDb)
      .values({
        username: body.username,
        password: await hash(body.password),
      })
      .returning()
      .onConflictDoNothing();

    if (!user)
      throw createError({
        statusCode: 400,
        statusMessage: "user creation failed",
      });

    await tx.insert(profileDb).values({
      user: user.id,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
    });
  });

  return { status: "ok" };
});
