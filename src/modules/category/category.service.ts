import { prisma } from "../../lib/prisma"
import slugify from "../../utils/slugify";


const createCategory = async (payload: ICategoryPayload) => {
    console.log(payload)
    const slug = slugify(payload.name);
    console.log(slug)
    const result = await prisma.category.create({
        data: {
            name: payload.name,
            description: payload.description,
            slug
        }
    })
    return result
}

export const categoryService = { createCategory }