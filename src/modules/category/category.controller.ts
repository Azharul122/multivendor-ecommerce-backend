import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const payload: ICategoryPayload = req.body;
    const file = req.file as Express.Multer.File;
    const result = await categoryService.createCategory({ ...payload, image: file.path });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category created successfully",
        data: result,
    })
})

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategory();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all category successfully",
        data: result,
    })
})

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await categoryService.getSingleCategory(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single category successfully",
        data: result,
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const file = req.file as Express.Multer.File;
    const payload: ICategoryPayload = req.body;
    const result = await categoryService.updateCategory(id as string, { ...payload, image: file.path });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: result,
    })
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await categoryService.deleteCategory(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: result,
    })
})

export const categoryController = { createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory }