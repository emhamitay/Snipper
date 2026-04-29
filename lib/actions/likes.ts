// בעה"י
"use server";

import { db } from "../db";
import { likes } from "../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";

export async function toggleLike(snippetId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be logged in to like a snippet");
  }

  const userId = session.user.id;

  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.snippetId, snippetId)))
    .limit(1);

  if (existingLike.length > 0) {
    // Unlike
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.snippetId, snippetId)));
  } else {
    // Like
    await db.insert(likes).values({
      userId,
      snippetId,
    });
  }

  revalidatePath(`/dashboard/snippets/${snippetId}`);
  revalidatePath("/"); // Revalidate landing/explore if needed
}


export async function getSnippetLikes(snippetId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [likesData] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(likes)
    .where(eq(likes.snippetId, snippetId));

  let isLiked = false;
  if (userId) {
    const [userLike] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.snippetId, snippetId)))
      .limit(1);
    isLiked = !!userLike;
  }

  return {
    count: likesData?.count || 0,
    isLiked,
  };
}

