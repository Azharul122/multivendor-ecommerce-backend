

// .................... Create Review .....................

import { ca } from "zod/v4/locales";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import sendResponse from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user?.userId
    const { productId } = req.params
    const result = await ReviewService.addReview(productId as string, userId as string, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review created successfully",
        data: result,
    })
})

// .......................... Get All Reviews .........................

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviews();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all reviews successfully",
        data: result,
    })
})

// .......................... Get Single Review .........................

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ReviewService.getSingleReview(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single review successfully",
        data: result,
    })
})

// .......................... Delete Review ...........................

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ReviewService.deleteReview(id as string, req.body.reason);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review deleted successfully",
        data: result,
    })
})

export const reviewController = { createReview, getAllReviews, getSingleReview, deleteReview }