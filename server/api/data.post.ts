export default defineEventHandler(async (event) => {
  await withAccessToken(event);

  const data = await readBody(event);
  console.log(data);

  return { status: "ok" };
});
