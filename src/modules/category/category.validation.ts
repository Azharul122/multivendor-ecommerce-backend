import z from "zod";


const CategoryValidation = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(200, "Category name is too long"),
    description: z
        .string()
        .max(500, "Category description is too long")
        .optional(),
    slug: z
        .string()
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers and hyphens"
        ).optional(),
})

export const categoryValidation = { CategoryValidation }