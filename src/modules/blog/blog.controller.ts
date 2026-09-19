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

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await blogService.getAllBlogs();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all blogs successfully",
        data: result,
    });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await blogService.getSingleBlog(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single blog successfully",
        data: result,
    });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
     const payload: IBlogPayload =
        typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;

    const files = req.files as {
        image?: Express.Multer.File[];
        video?: Express.Multer.File[];
        coverImage?: Express.Multer.File[];
    };

    const result = await blogService.updateBlog(id as string, { ...payload, image: files?.image?.[0]?.path, video: files?.video?.[0]?.path, coverImage: files?.coverImage?.[0]?.path });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog updated successfully",
        data: result,
    });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await blogService.deleteBlog(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
});

const blogByProduct = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await blogService.blogByProduct(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get blog by product successfully",
        data: result,
    });
});


export const blogController = { createBlog, getAllBlogs, getSingleBlog, updateBlog, deleteBlog, blogByProduct }