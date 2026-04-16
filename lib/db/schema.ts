// בעה"י
import { pgTable, uuid, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  githubId: varchar("github_id", { length: 255 }).unique(),
});

export const snippets = pgTable('snippets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  language: varchar('language', { length: 50 }).notNull(),
  code: text('code').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  isPublic: boolean('is_public').notNull().default(false)
})