import type { H3Event } from "h3";

import jwt from "jsonwebtoken";

export interface TokenPayload {
  user: number;
}

export default async function (event: H3Event) {
  if (useRuntimeConfig().disableAuth === "TRUE") return {} as TokenPayload;

  const access_token =
    getCookie(event, "access_token") || event.context.access_token;

  if (!access_token)
    throw createError({
      statusCode: 401,
      statusMessage: "missing access_token",
    });

  try {
    const { tokenSecret } = useRuntimeConfig();
    const token = jwt.verify(access_token, tokenSecret);
    return token as TokenPayload;
  } catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: "invalide access_token",
    });
  }
}
