// בעה"י
import { snippets, users, likes, tags, snippetTags } from "../schema";
import { db } from "../index"
import { eq, and, ne, sql, isNull, desc, or, ilike, inArray } from "drizzle-orm";
import { create } from "domain";

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
    return snippet[0] || null;
}

export async function getSnippetBySlug(userId: string, slug: string) : Promise<Snippet | null> {
    const snippet = await db
        .select()
        .from(snippets)
        .where(and(eq(snippets.userId, userId), eq(snippets.slug, slug)))
        .limit(1);
    return snippet[0] || null;
}

export async function getPublicSnippetsByUserId(userId: string) : Promise<Snippet[]> {
    return await db.select().from(snippets).where(and(eq(snippets.userId, userId), eq(snippets.isPublic, true)));
}

export async function isSnippetTitleAvailable(
    title: string,
    userId: string,
    excludeSnippetId?: string,
): Promise<boolean> {
    const normalizedTitle = title.toLowerCase();
    const conditions = [
        eq(snippets.userId, userId),
        sql`lower(${snippets.title}) = ${normalizedTitle}`,
    ];
    if (excludeSnippetId) {
        conditions.push(ne(snippets.id, excludeSnippetId));
    }

    const snippet = await db
        .select({ id: snippets.id })
        .from(snippets)
        .where(and(...conditions))
        .limit(1);
    return snippet.length === 0;
}

export async function isSnippetSlugAvailable(
    slug: string,
    userId: string,
    excludeSnippetId?: string,
): Promise<boolean> {
    const conditions = [
        eq(snippets.userId, userId),
        eq(snippets.slug, slug),
    ];
    if (excludeSnippetId) {
        conditions.push(ne(snippets.id, excludeSnippetId));
    }

    const snippet = await db
        .select({ id: snippets.id })
        .from(snippets)
        .where(and(...conditions))
        .limit(1);
    return snippet.length === 0;
}

export async function getSnippetsByUserId(userId: string) {
    return await db.select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        createdAt: snippets.createdAt,
        language: snippets.language,
        isPublic: snippets.isPublic,
        slug: snippets.slug,
        folderId: snippets.folderId,
    }).from(snippets).where(eq(snippets.userId, userId));
}

export type SnippetCardInfo = Awaited<ReturnType<typeof getSnippetsByUserId>>[number]

export async function getSnippetCountsByFolderForUser(userId: string): Promise<Record<string, number>> {
    const result = await db
        .select({
            folderId: snippets.folderId,
            count: sql<number>`count(*)::int`,
        })
        .from(snippets)
        .where(eq(snippets.userId, userId))
        .groupBy(snippets.folderId);

    return Object.fromEntries(
        result
            .filter((r) => r.folderId !== null)
            .map((r) => [r.folderId!, r.count])
    );
}

export async function getRootSnippetsByUserId(userId: string) {
    return await db.select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        createdAt: snippets.createdAt,
        language: snippets.language,
        isPublic: snippets.isPublic,
        slug: snippets.slug,
        folderId: snippets.folderId,
    }).from(snippets).where(
        and(eq(snippets.userId, userId), isNull(snippets.folderId))
    );
}

export type PublicSnippetCardInfo = {
    id: string;
    title: string;
    description: string | null;
    language: string;
    slug: string;
    createdAt: Date;
    username: string;
    likeCount: number;
};

export type PublicSnippetSort = "newest" | "popular";

interface GetPublicSnippetsParams {
    limit: number;
    offset?: number;
    language?: string;
    search?: string;
    sort?: PublicSnippetSort;
}

export async function getPublicSnippets({
    limit,
    offset = 0,
    language,
    search,
    sort = "newest",
}: GetPublicSnippetsParams): Promise<PublicSnippetCardInfo[]> {
    const conditions = [eq(snippets.isPublic, true)];

    if (language) {
        conditions.push(eq(snippets.language, language));
    }

    if (search && search.trim().length > 0) {
        const term = `%${search.trim()}%`;
        // Match snippets whose title/description matches OR whose tags match
        const taggedSnippetIds = db
            .select({ snippetId: snippetTags.snippetId })
            .from(snippetTags)
            .innerJoin(tags, eq(snippetTags.tagId, tags.id))
            .where(ilike(tags.name, term));

        const matchExpr = or(
            ilike(snippets.title, term),
            ilike(snippets.description, term),
            inArray(snippets.id, taggedSnippetIds),
        );
        if (matchExpr) conditions.push(matchExpr);
    }

    const likeCountExpr = sql<number>`(select count(*)::int from ${likes} where ${likes.snippetId} = ${snippets.id})`;

    const orderBy =
        sort === "popular"
            ? [desc(likeCountExpr), desc(snippets.createdAt)]
            : [desc(snippets.createdAt)];

    const rows = await db
        .select({
            id: snippets.id,
            title: snippets.title,
            description: snippets.description,
            language: snippets.language,
            slug: snippets.slug,
            createdAt: snippets.createdAt,
            username: users.username,
            likeCount: likeCountExpr,
        })
        .from(snippets)
        .innerJoin(users, eq(snippets.userId, users.id))
        .where(and(...conditions))
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset);

    return rows;
}

export async function getFeaturedPublicSnippets(limit: number = 6): Promise<PublicSnippetCardInfo[]> {
    return getPublicSnippets({ limit, sort: "newest" });
}

export async function getLikedSnippetIdsForUser(userId: string, snippetIds: string[]): Promise<Set<string>> {
    if (snippetIds.length === 0) return new Set();
    const rows = await db
        .select({ snippetId: likes.snippetId })
        .from(likes)
        .where(and(eq(likes.userId, userId), inArray(likes.snippetId, snippetIds)));
    return new Set(rows.map((r) => r.snippetId));
}

export async function setSnippetFolder(id: string, folderId: string | null) {
    const updatedAt = new Date();
    return await db
        .update(snippets)
        .set({ folderId, updatedAt })
        .where(eq(snippets.id, id))
        .returning();
}
