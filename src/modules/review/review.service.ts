

// .................................... add review to product .......................................................

import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const addReview = async (id: string, userId: string, data: IReviewPayload) => {
    // check already purchased
    const isPurchased = await prisma.order.findFirst({
        where: {
            products: {
                some: {
                    id,
                },
            },
            userId: userId,
        },
    })

    if (!isPurchased) {
        throw new AppError(status.BAD_REQUEST, "You have not purchased this product")
    }
    // check already reviewed
    const isAlreadyReviewed = await prisma.review.findFirst({
        where: {
            productId: id,
            userId: userId,
        },
    })

    if (isAlreadyReviewed) {
        throw new AppError(status.BAD_REQUEST, "You have already reviewed this product")
    }

    const product = await prisma.product.findUnique({
        where: { id },
        select: { sellerId: true },
    });

    if (!product) {
        throw new AppError(status.NOT_FOUND, "Product not found")
    }

    const result = await prisma.review.create({
        data: {
            productId: id,
            userId: userId,
            sellerId: product.sellerId,
            rating: data.rating,
            comment: data.review,
        }
    });
    return result;
};

// get all reviews

const getAllReviews = async () => {
    const result = await prisma.review.findMany(
      
    );
    return result;
}

// ..................................... get single review .......................................................

const getSingleReview = async (id: string) => {
    const result = await prisma.review.findUnique({
        where: { id },
        include: {
            user: true,
            seller: true,
        },
    });
    return result;
}

// ..................................... delete review .......................................................


const deleteReview = async (id: string, reason : string) => {
    const result = await prisma.review.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),

        },
    });
    return result;
}


export const ReviewService = {
    addReview,
    getAllReviews,
    getSingleReview,
    deleteReview
}