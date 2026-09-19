import z from "zod"



const reviewValidation = z.object({
    review: z.string().min(1, "Review is required").max(500, "Review is too long (500 characters maximum)"),
    rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
})

export const reviewValidationSchema = { reviewValidation }