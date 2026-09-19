import status from "http-status";
import { uploadFileToCloudinary } from "../../configs/cloudinary";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import slugify from "../../utils/slugify";
import { IProductPayload } from "./product.interface";


const createProduct = async (payload: IProductPayload) => {
    const {
        name,
        description,
        price,
        images,
        categoryIds,
        stock,
        isFeatured,
        isVerified,
        seller,
    } = payload;

    if (!images || images.length === 0) {
        throw new AppError(
            status.BAD_REQUEST,
            "At least one product image is required"
        );
    }

    if (!categoryIds || categoryIds.length === 0) {
        throw new AppError(
            status.BAD_REQUEST,
            "At least one category is required"
        );
    }

    const makeSlug = slugify(name);

    const result = await prisma.product.create({
        data: {
            name,
            description,
            price,
            images,
            slug: makeSlug,
            stock,
            isFeatured,
            isVerified,
            seller: {
                connect: { userId: seller.userId },
            },
            categories: {
                connect: categoryIds.map((id) => ({ id })),
            },
        },
        include: {
            categories: true,
        },
    });

    return result;
};

const allProducts = async () => {
    const result = await prisma.product.findMany({
        include: {
            categories: true,
            seller: true,
        },
    });
    return result;
};

const getSingleProduct = async (id: string) => {
    const result = await prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            categories: true,
            seller: true,
        },
    });
    return result;
};

// ............................................... Recent view Product .......................................................................

const resendViewProducts = async (id: string) => {
    const result = await prisma.product.update({
        where: {
            id,
        },
        data: {
            views: {
                increment: 1,
            },
        },
    });
    return result;
};

// ............................................... Delete Product .......................................................................

const deleteProduct = async (id: string) => {
    const result = await prisma.product.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    // Soft delete all reviews
    await prisma.review.updateMany({
        where: {
            productId: id,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    // Find orders containing this product
    const orders = await prisma.order.findMany({
        where: {
            products: {
                some: {
                    id,
                },
            },
        },
        select: {
            id: true,
        },
    });

    // Soft delete those orders
    await prisma.order.updateMany({
        where: {
            id: {
                in: orders.map((order) => order.id),
            },
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};
// ............................................... Update Product .......................................................................

const updateProduct = async (id: string, payload: IProductPayload) => {
    const result = await prisma.product.update({
        where: {
            id,
        },
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            images: payload.images,
            stock: payload.stock,
            isFeatured: payload.isFeatured,
            isVerified: payload.isVerified,
        },
    });
    return result;
};

export const productService = { createProduct, allProducts, getSingleProduct, resendViewProducts, deleteProduct, updateProduct };