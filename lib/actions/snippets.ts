// בעה"י
"use server";

import * as query from "../db/queries/snippets";
import type {
  Snippet,
  NewSnippet,
  UpdateSnippetFields,
} from "../db/queries/snippets";
import { createSnippetSchema } from "../validations/snippets";

export async function createSnippet(snippet: NewSnippet) {
  //validate
  const result = createSnippetSchema.safeParse(snippet);
  if (result.success === false) {
    throw new Error(result.error.errors.map((e) => e.message).join(", "));
  }

  const [created] = await query.createSnippet(snippet);
  return created;
}

export async function getSnippetById(id: string): Promise<Snippet | null> {
  const snippet = await query.getSnippetById(id);
  return snippet;
}

export async function getSnippetsByUserId(userId: string): Promise<Snippet[]> {
  const snippets = await query.getSnippetsByUserId(userId);
  return snippets;
}

export async function updateSnippet(id: string, snippet: UpdateSnippetFields) {
  const result = createSnippetSchema.partial().safeParse(snippet);
  if (result.success === false) {
    throw new Error(result.error.errors.map((e) => e.message).join(", "));
  }

  await query.updateSnippet(id, snippet);
}

export async function deleteSnippet(id: string) {
  await query.deleteSnippet(id);
}

export async function getPublicSnippetsByUserId(
  userId: string,
): Promise<Snippet[]> {
  const snippets = await query.getPublicSnippetsByUserId(userId);
  return snippets;
}
