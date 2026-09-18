import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";


const createCategory= catchAsync(async (req: Request, res: Response) => {
    const payload: ICategoryPayload = req.body;
    const result = await categoryService.createCategory(payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category created successfully",
        data: result,
    })
})

export const categoryController = { createCategory }