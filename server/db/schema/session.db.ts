import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userDb } from "./user.db";
import { relations } from "drizzle-orm";

export const sessionDb = sqliteTable("session", {
  user: int()
    .notNull()
    .references(() => userDb.id, { onDelete: "cascade" }),
  name: text(),
  agent: text(),
  token: text().notNull(),
  last_login: int({ mode: "timestamp" }),
  created_at: int({ mode: "timestamp" }).defaultNow(),
});

export const sessionRelations = relations(sessionDb, ({ one }) => ({
  user: one(userDb, {
    fields: [sessionDb.user],
    references: [userDb.id],
  }),
}));
