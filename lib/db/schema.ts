// בעה"י
import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
