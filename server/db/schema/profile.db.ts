import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userDb } from "./user.db";
import { relations } from "drizzle-orm";

export const profileDb = sqliteTable("profile", {
  id: int().primaryKey({ autoIncrement: true }),
  user: int()
    .notNull()
    .references(() => userDb.id, { onDelete: "cascade" }),
  first_name: text(),
  last_name: text(),
  email: text().notNull().unique(),
  phone: text(),
});

export const profileRelations = relations(profileDb, ({ one }) => ({
  user: one(userDb, {
    fields: [profileDb.user],
    references: [userDb.id],
  }),
}));
