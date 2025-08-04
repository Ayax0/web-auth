import type { H3Event } from "h3";

import { eq } from "drizzle-orm";
import { userDb, profileDb } from "../db/schema";

export interface AzureUser {
  id: string;
  userPrincipalName: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  mail: string;
  mobilePhone?: string;
  businessPhones: string[];
  officeLocation?: string;
  preferredLanguage?: string;
  jobTitle?: string;
}

export default async function (event: H3Event) {
  const authorization = getHeader(event, "Authorization");
  const match = authorization?.match(/^Bearer (.+)$/);

  if (!match || !match[1])
    throw createError({ statusCode: 401, statusMessage: "missing auth" });

  const azure_user = await $fetch<AzureUser>("/me", {
    baseURL: "https://graph.microsoft.com/v1.0",
    onRequest: ({ options }) => {
      options.headers = new Headers(options.headers);
      options.headers.append("Authorization", `Bearer ${match[1]}`);
    },
  });

  if (!azure_user)
    throw createError({
      statusCode: 403,
      statusMessage: "verification failed",
    });

  const user = await useDrizzle().query.userDb.findFirst({
    where: eq(userDb.ad, azure_user.id),
    with: { profile: true },
  });

  if (user) return user;

  const user_id = await useDrizzle().transaction(async (tx) => {
    const [new_user] = await tx
      .insert(userDb)
      .values({ ad: azure_user.id })
      .returning({ id: userDb.id });

    if (!new_user) return tx.rollback();

    await tx.insert(profileDb).values({
      user: new_user.id,
      first_name: azure_user.givenName,
      last_name: azure_user.surname,
      email: azure_user.mail,
      phone: azure_user.mobilePhone || azure_user.businessPhones[0],
    });

    return new_user.id;
  });

  const _user = await useDrizzle().query.userDb.findFirst({
    where: eq(userDb.id, user_id),
    with: { profile: true },
  });

  if (!_user)
    throw createError({
      statusCode: 500,
      statusMessage: "server error",
    });

  return _user;
}
