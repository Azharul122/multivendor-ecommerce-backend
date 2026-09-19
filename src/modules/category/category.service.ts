import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import slugify from "../../utils/slugify";


const createCategory = async (payload: ICategoryPayload) => {

    const slug = slugify(payload.name);

    // already exist slug
    const isAlreadyExist = await prisma.category.findUnique({
        where: {
            slug
        }
    })

    if (isAlreadyExist) {
        throw new AppError(status.BAD_REQUEST, "Category Already exist")
    }
    const result = await prisma.category.create({
        data: {
            name: payload.name,
            description: payload.description,
            slug,
            image: payload.image
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
            description: payload.description,
            image: payload.image
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