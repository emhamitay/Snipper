import { z } from "zod";

export const createSnippetSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().optional(),
    code: z.string().min(1, "Code content is required"),
    language: z.string().min(1, "Language is required"),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    slug: z
        .string()
        .trim()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
});


