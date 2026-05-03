// בעה"י
import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  githubId: varchar("github_id", { length: 255 }).unique(),
});

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("folders_user_id_name_ci_unique").on(
      table.userId,
      sql`lower(${table.name})`,
    ),
    uniqueIndex("folders_user_id_slug_unique").on(table.userId, table.slug),
  ],
);

export const snippets = pgTable(
  "snippets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    language: varchar("language", { length: 50 }).notNull(),
    code: text("code").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    isPublic: boolean("is_public").notNull().default(false),
    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "set null",
    }),
    slug: varchar("slug", { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex("snippets_user_id_title_ci_unique").on(
      table.userId,
      sql`lower(${table.title})`,
    ),
    uniqueIndex("snippets_user_id_slug_unique").on(table.userId, table.slug),
  ],
);

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    snippetId: uuid("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("likes_user_id_snippet_id_unique").on(
      table.userId,
      table.snippetId,
    ),
  ],
);

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const snippetTags = pgTable(
  "snippet_tags",
  {
    snippetId: uuid("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("snippet_tags_snippet_id_tag_id_unique").on(
      table.snippetId,
      table.tagId,
    ),
  ],
);
