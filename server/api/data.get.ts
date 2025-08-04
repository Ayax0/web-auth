export default defineEventHandler(async (event) => {
  await withAccessToken(event);

  return {
    secret: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
});
