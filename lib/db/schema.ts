// בעה"י
import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  githubId: varchar("github_id", { length: 255 }).unique(),
});
