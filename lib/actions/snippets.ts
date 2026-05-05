// בעה"י
"use server";

import * as query from "../db/queries/snippets";
import type {
  Snippet,
  NewSnippet,
  UpdateSnippetFields,
} from "../db/queries/snippets";
import { createSnippetSchema } from "../validations/snippets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";

import { updateSnippetTags } from "./tags";
import { generateSlug } from "../slug";

export async function isSnippetTitleAvailable(
  title: string,
  excludeSnippetId?: string,
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return false;
  }

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return false;
  }

  const available = await query.isSnippetTitleAvailable(
    normalizedTitle,
    userId,
    excludeSnippetId,
  );
  return available;
}

export async function isSnippetSlugAvailable(
  slug: string,
  excludeSnippetId?: string,
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return false;
  }

  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return false;
  }

  const available = await query.isSnippetSlugAvailable(
    normalizedSlug,
    userId,
    excludeSnippetId,
  );
  return available;
}

export async function createSnippet(snippet: Omit<NewSnippet, "userId" | "slug"> & { tags?: string[]; slug?: string }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const normalizedTitle = snippet.title.trim();
  const slugToUse = snippet.slug?.trim() || generateSlug(normalizedTitle);

  const validationPayload = { ...snippet, title: normalizedTitle, slug: slugToUse };
  const result = createSnippetSchema.safeParse(validationPayload);
  if (result.success === false) {
    throw new Error(result.error.errors.map((e) => e.message).join(", "));
  }

  const titleAvailable = await query.isSnippetTitleAvailable(
    normalizedTitle,
    userId,
  );
  if (!titleAvailable) {
    throw new Error("Snippet name is already taken");
  }

  const slugAvailable = await query.isSnippetSlugAvailable(slugToUse, userId);
  if (!slugAvailable) {
    throw new Error("URL slug is already taken. Try a different title or custom slug.");
  }

  const { tags: tagNames, ...snippetData } = validationPayload;

  const [created] = await query.createSnippet({
    ...snippetData,
    userId,
  });

  if (tagNames && tagNames.length > 0) {
    await updateSnippetTags(created.id, tagNames);
  }

  return created;
}

export async function getSnippetById(id: string): Promise<Snippet | null> {
  const snippet = await query.getSnippetById(id);
  return snippet;
}

export async function getSnippetBySlug(username: string, slug: string): Promise<Snippet | null> {
  console.log(`[getSnippetBySlug] Looking up snippet for user: ${username}, slug: ${slug}`);
  const user = await import("../db/queries/users").then(m => m.getUserByUsername(username));
  
  if (!user) {
    console.log(`[getSnippetBySlug] User not found: ${username}`);
    return null;
  }
  
  const snippet = await query.getSnippetBySlug(user.id, slug);
  if (!snippet) {
    console.log(`[getSnippetBySlug] Snippet not found for user ${user.id} with slug: ${slug}`);
  }
  
  return snippet;
}


export async function getSnippetsByUserId(userId: string): Promise<Snippet[]> {
  const snippets = await query.getSnippetsByUserId(userId);
  return snippets;
}

export async function updateSnippet(id: string, snippet: UpdateSnippetFields & { tags?: string[]; slug?: string }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await query.getSnippetById(id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const { tags: tagNames, ...snippetData } = snippet;

  if (typeof snippetData.title === "string") {
    snippetData.title = snippetData.title.trim();
    if (!snippetData.title) {
      throw new Error("Title is required");
    }

    if (snippetData.title !== existing.title) {
      const titleAvailable = await query.isSnippetTitleAvailable(
        snippetData.title,
        userId,
        id,
      );
      if (!titleAvailable) {
        throw new Error("Snippet name is already taken");
      }
      
      // Auto-update slug if not explicitly provided
      if (!snippetData.slug) {
        snippetData.slug = generateSlug(snippetData.title);
      }
    }
  }

  if (snippetData.slug) {
    snippetData.slug = snippetData.slug.trim();
    if (snippetData.slug !== existing.slug) {
      const slugAvailable = await query.isSnippetSlugAvailable(snippetData.slug, userId, id);
      if (!slugAvailable) {
        throw new Error("URL slug is already taken");
      }
    }
  }

  const validationResult = createSnippetSchema.partial().safeParse(snippetData);
  if (validationResult.success === false) {
    throw new Error(validationResult.error.errors.map((e) => e.message).join(", "));
  }

  await query.updateSnippet(id, snippetData);

  if (tagNames) {
    await updateSnippetTags(id, tagNames);
  }
}



export async function deleteSnippet(id: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await query.getSnippetById(id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await query.deleteSnippet(id);
}

export async function moveSnippetToFolder(snippetId: string, folderId: string | null) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await query.getSnippetById(snippetId);
  if (!existing || existing.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (folderId) {
    const folder = await import("../db/queries/folders").then((m) =>
      m.getFolderById(folderId),
    );
    if (!folder || folder.userId !== userId) {
      throw new Error("Folder not found");
    }
  }

  if ((existing.folderId ?? null) === folderId) {
    return;
  }

  await query.setSnippetFolder(snippetId, folderId);
}

export async function getPublicSnippetsByUserId(
  userId: string,
): Promise<Snippet[]> {
  const snippets = await query.getPublicSnippetsByUserId(userId);
  return snippets;
}
