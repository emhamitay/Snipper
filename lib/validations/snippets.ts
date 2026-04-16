import { z } from "zod";

export const createSnippetSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    code: z.string().min(1, "Code content is required"),
    language: z.string().min(1, "Language is required"),
    isPublic: z.boolean().optional()
});
