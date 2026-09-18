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
                connect: { id: seller.userId },
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

export const productService = { createProduct };