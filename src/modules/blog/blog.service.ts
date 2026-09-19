
import { deleteFileFromCloudinary } from "../../configs/cloudinary";
import { prisma } from "../../lib/prisma";


// .......................... Create Blog ..............................
export const createBlog = async (payload: IBlogPayload) => {
    const { title, content, image, video, coverImage, userId, productId } = payload

    const result = await prisma.blog.create({
        data: {
            title,
            content,
            image,
            video,
            coverImage: coverImage,
            userId,
            productId
        }
    });


    return result;
}


// .......................... Get All Blog ..............................

const getAllBlogs = async () => {
    const result = await prisma.blog.findMany();
    return result;
}

// .......................... Get Single Blog ..............................

const getSingleBlog = async (id: string) => {
    const result = await prisma.blog.findUnique({ where: { id } });
    return result;
}

// .......................... Update Blog ..............................

const updateBlog = async (id: string, payload: IBlogPayload) => {
    const blog = await prisma.blog.findUniqueOrThrow({ where: { id } });

    const result = await prisma.blog.update({ where: { id }, data: payload });

    const deletions: Promise<any>[] = [];

    if (payload.image && payload.image !== blog.image && blog.image) {
        deletions.push(deleteFileFromCloudinary(blog.image));
    }
    if (payload.video && payload.video !== blog.video && blog.video) {
        deletions.push(deleteFileFromCloudinary(blog.video));
    }
    if (payload.coverImage && payload.coverImage !== blog.coverImage && blog.coverImage) {
        deletions.push(deleteFileFromCloudinary(blog.coverImage));
    }

    await Promise.allSettled(deletions);

    return result;
};

// .......................... Delete Blog ..............................

const deleteBlog = async (id: string) => {
    const result = await prisma.blog.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
    return result;
}

// .......................... Blog by Product ..............................

const blogByProduct = async (id: string) => {
    const result = await prisma.blog.findMany({ where: { productId: id }, include: { author: { select: { name: true, email: true, image: true } } } });
    return result;
}



export const blogService = { createBlog, getAllBlogs, getSingleBlog, updateBlog, deleteBlog, blogByProduct }