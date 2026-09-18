import z from "zod";

const ProductValidation = z.object({
    name: z
        .string()
        .min(1, "Product name is required")
        .max(200, "Product name is too long"),

    description: z
        .string()
        .min(1, "Description is required"),

    price: z
        .number()
        .positive("Price must be greater than 0"),

    images: z
        .array(z.string().url("Invalid image URL"))
        .min(1, "At least one image is required"),

    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),

    categoryIds: z
        .array(z.string())
        .min(1, "At least one category is required"),

    stock: z
        .number()
        .int("Stock must be an integer")
        .nonnegative("Stock cannot be negative"),

    isFeatured: z
        .boolean()
        .default(false),

    isVerified: z
        .boolean()
        .default(false),
});

export { ProductValidation };