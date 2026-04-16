// בעה"י
import { snippets } from "../schema";
import { db } from "../index"
import { eq, and } from "drizzle-orm";

export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;
export type UpdateSnippetFields = Partial<Omit<NewSnippet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

export async function createSnippet(newSnippet : NewSnippet){
    return await db.insert(snippets).values(newSnippet).returning();
}

export async function updateSnippet(id: string, updatedFields: UpdateSnippetFields)
 {
    const updatedAt = new Date(); // update the updatedAt field to current time
    return await db.update(snippets).set({ ...updatedFields, updatedAt }).where(eq(snippets.id, id)).returning();
}

export async function deleteSnippet(id: string) {
    return await db.delete(snippets).where(eq(snippets.id, id)).returning();
}

export async function getSnippetById(id: string) : Promise<Snippet | null> {
    const snippet = await db.select().from(snippets).where(eq(snippets.id, id)).limit(1);
    return snippet[0] || null; // return the snippet object or null if not found
}

export async function getPublicSnippetsByUserId(userId: string) : Promise<Snippet[]> {
    return await db.select().from(snippets).where(and(eq(snippets.userId, userId), eq(snippets.isPublic, true)));
}

export async function getSnippetsByUserId(userId: string) : Promise<Snippet[]> {
    return await db.select().from(snippets).where(eq(snippets.userId, userId));
}