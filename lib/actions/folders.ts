// בעה"י
"use server";

import * as query from "../db/queries/folders";
import type { Folder, NewFolder } from "../db/queries/folders";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";
import { generateSlug } from "../slug";

export async function isFolderNameAvailable(
  name: string,
  excludeFolderId?: string,
): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  if (!userId) {
    return false;
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return false;
  }

  return await query.isFolderNameAvailable(trimmedName, userId, excludeFolderId);
}

export async function createFolder(name: string): Promise<Folder> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Folder name is required");
  }

  const available = await query.isFolderNameAvailable(trimmedName, userId);
  if (!available) {
    throw new Error("Folder name already taken");
  }

  const slug = generateSlug(trimmedName);
  const newFolder: NewFolder = { userId, name: trimmedName, slug };

  return await query.createFolder(newFolder);
}

export async function updateFolder(id: string, name: string): Promise<Folder> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Folder name is required");
  }

  const existingFolder = await query.getFolderById(id);
  if (!existingFolder) {
    throw new Error("Not found");
  }

  if (existingFolder.userId !== userId) {
    throw new Error("Unauthorized");
  }

  let slug = existingFolder.slug;
  if (trimmedName !== existingFolder.name) {
    const available = await query.isFolderNameAvailable(trimmedName, userId, id);
    if (!available) {
      throw new Error("Folder name already taken");
    }

    slug = generateSlug(trimmedName);
  }

  return await query.updateFolder(id, { name: trimmedName, slug });
}

export async function deleteFolder(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingFolder = await query.getFolderById(id);
  if (!existingFolder) {
    throw new Error("Not found");
  }

  if (existingFolder.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await query.deleteFolder(id);
}

export async function getFoldersByUserId(): Promise<Folder[]> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await query.getFoldersByUserId(userId);
}
