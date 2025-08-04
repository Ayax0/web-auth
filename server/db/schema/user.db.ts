import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { profileDb } from "./profile.db";
import { sessionDb } from "./session.db";

export const userDb = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  ad: text().unique(),
  username: text().unique(),
  password: text(),
});

export const userRelations = relations(userDb, ({ one, many }) => ({
  profile: one(profileDb, {
    fields: [userDb.id],
    references: [profileDb.user],
  }),
  session: many(sessionDb),
}));
