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

// ............................................... All Category .......................................................................

const getAllCategory = async () => {
    const result = await prisma.category.findMany({})
    return result
}

// ............................................... Single Category .......................................................................

const getSingleCategory = async (id: string) => {
    const result = await prisma.category.findUnique({
        where: {
            id
        },
        include: {
            products: true
        }
    })
    return result
}

// ............................................... Update Category .......................................................................

const updateCategory = async (id: string, payload: ICategoryPayload) => {
    const result = await prisma.category.update({
        where: {
            id
        },
        data: {
            name: payload.name,
            description: payload.description
        }
    })
    return result
}

// ............................................... Delete Category .......................................................................

const deleteCategory = async (id: string) => {
    const result = await prisma.category.update({
        where: {
            id
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
    return result
}



export const categoryService = { createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory }