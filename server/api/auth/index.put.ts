import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const { user } = await withRefreshToken(event);

  console.log("refresh", Date.now());

  const config = useRuntimeConfig();
  const expiresIn = parseInt(config.public.accessTokenTimeout || "0");

  const access_token = jwt.sign({ user: user.id }, config.tokenSecret, {
    expiresIn,
  });

  setCookie(event, "access_token", access_token, {
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: true,
    sameSite: true,
  });

  return { access_token };
});
