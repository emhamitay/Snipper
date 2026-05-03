// בעה"י
import { folders } from "../schema";
import { db } from "../index";
import { eq, and, ne, sql } from "drizzle-orm";

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export async function getFoldersByUserId(userId: string): Promise<Folder[]> {
    return await db
        .select()
        .from(folders)
        .where(eq(folders.userId, userId))
        .orderBy(folders.name);
}

export async function getFolderBySlug(userId: string, slug: string): Promise<Folder | null> {
    const result = await db
        .select()
        .from(folders)
        .where(and(eq(folders.userId, userId), eq(folders.slug, slug)))
        .limit(1);
    return result[0] || null;
}

export async function getFolderById(id: string): Promise<Folder | null> {
    const result = await db
        .select()
        .from(folders)
        .where(eq(folders.id, id))
        .limit(1);
    return result[0] || null;
}

export async function isFolderNameAvailable(
    name: string,
    userId: string,
    excludeFolderId?: string,
): Promise<boolean> {
    const conditions = [
        eq(folders.userId, userId),
        sql`lower(${folders.name}) = ${name.toLowerCase()}`,
    ];
    if (excludeFolderId) {
        conditions.push(ne(folders.id, excludeFolderId));
    }

    const result = await db
        .select({ id: folders.id })
        .from(folders)
        .where(and(...conditions))
        .limit(1);
    return result.length === 0;
}

export async function createFolder(newFolder: NewFolder): Promise<Folder> {
    const result = await db.insert(folders).values(newFolder).returning();
    return result[0];
}

export async function updateFolder(id: string, fields: { name?: string; slug?: string }): Promise<Folder> {
    const result = await db
        .update(folders)
        .set(fields)
        .where(eq(folders.id, id))
        .returning();
    return result[0];
}

export async function deleteFolder(id: string): Promise<void> {
    await db.delete(folders).where(eq(folders.id, id));
}
