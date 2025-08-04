export default defineEventHandler(async (event) => {
  await withAccessToken(event);
  return { status: "ok" };
});
