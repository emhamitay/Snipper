// בעה"י
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {
  getPublicSnippets,
  getLikedSnippetIdsForUser,
  type PublicSnippetCardInfo,
  type PublicSnippetSort,
} from "../db/queries/snippets";

export interface ExploreQueryParams {
  limit: number;
  offset: number;
  language?: string;
  search?: string;
  sort?: PublicSnippetSort;
}

export interface ExplorePageResult {
  snippets: PublicSnippetCardInfo[];
  likedIds: string[];
  isLoggedIn: boolean;
}

export async function loadMorePublicSnippets(
  params: ExploreQueryParams,
): Promise<ExplorePageResult> {
  const snippets = await getPublicSnippets(params);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let likedIds: string[] = [];
  if (userId && snippets.length > 0) {
    const set = await getLikedSnippetIdsForUser(
      userId,
      snippets.map((s) => s.id),
    );
    likedIds = Array.from(set);
  }

  return {
    snippets,
    likedIds,
    isLoggedIn: !!userId,
  };
}
