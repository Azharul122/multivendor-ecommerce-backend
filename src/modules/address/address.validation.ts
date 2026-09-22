import z from "zod"


const addressSchema = z.object({
    address: z.string().min(5, "Address is required"),
    addressLineOne: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Pincode is required"),
    country: z.string().min(1, "Country is required"),
})

export const addressValidation = { addressSchema }