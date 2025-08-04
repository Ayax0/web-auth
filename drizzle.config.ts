import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./server/db/schema/**/*.db.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: ".data/db.sqlite",
  },
});
