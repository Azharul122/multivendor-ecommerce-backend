import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { blogService } from "./blog.service";
import sendResponse from "../../utils/sendResponse";
import { IRequestUser } from "../../types/user";

const createBlog = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as IRequestUser
    const { productId } = req.params
    const payload: IBlogPayload =
        typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
    const files = req.files as {
        image?: Express.Multer.File[];
        video?: Express.Multer.File[];
        coverImage?: Express.Multer.File[];
    };

    const result = await blogService.createBlog({
        ...payload,
        image: files?.image?.[0]?.path,
        video: files?.video?.[0]?.path,
        coverImage: files?.coverImage?.[0]?.path,
        userId: userId as string,
        productId: productId as string
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog created successfully",
        data: result,
    });
});

export const blogController = { createBlog }