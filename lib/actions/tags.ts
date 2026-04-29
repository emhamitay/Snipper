// בעה"י
"use server";

import { db } from "../db";
import { tags, snippetTags } from "../db/schema";
import { eq, ilike, inArray, sql } from "drizzle-orm";

export async function getSuggestedTags(query: string) {
  if (!query) return [];
  return await db
    .select()
    .from(tags)
    .where(ilike(tags.name, `%${query}%`))
    .limit(5);
}

export async function getSnippetTags(snippetId: string) {
  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(snippetTags)
    .innerJoin(tags, eq(snippetTags.tagId, tags.id))
    .where(eq(snippetTags.snippetId, snippetId));
  
  return result;
}

export async function updateSnippetTags(snippetId: string, tagNames: string[]) {
  // 1. Ensure all tags exist in the 'tags' table
  const uniqueTagNames = [...new Set(tagNames.map(t => t.trim().toLowerCase()))].filter(Boolean);
  
  if (uniqueTagNames.length === 0) {
    // If no tags, just delete existing associations
    await db.delete(snippetTags).where(eq(snippetTags.snippetId, snippetId));
    return;
  }

  // Find existing tags
  const existingTags = await db
    .select()
    .from(tags)
    .where(inArray(tags.name, uniqueTagNames));
  
  const existingTagNames = existingTags.map(t => t.name);
  const newTagNames = uniqueTagNames.filter(name => !existingTagNames.includes(name));

  // Insert new tags
  let allTags = [...existingTags];
  if (newTagNames.length > 0) {
    const insertedTags = await db.insert(tags).values(
      newTagNames.map(name => ({ name }))
    ).returning();
    allTags = [...allTags, ...insertedTags];
  }

  // 2. Update snippet_tags junction table
  // First, delete old ones
  await db.delete(snippetTags).where(eq(snippetTags.snippetId, snippetId));
  
  // Then insert new ones
  if (allTags.length > 0) {
    await db.insert(snippetTags).values(
      allTags.map(tag => ({
        snippetId,
        tagId: tag.id,
      }))
    );
  }
}
