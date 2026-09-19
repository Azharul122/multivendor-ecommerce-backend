import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { productService } from "./product.service";
import catchAsync from "../../utils/catchAsync";


const createProduct = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const files = req.files as Express.Multer.File[];
        const seller= req.user;

        const result = await productService.createProduct({ ...payload, images: files.map((file) => file.path), seller });

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Product created successfully",
            data: result,
        })
    }
)

// ............................................... All Product .......................................................................

const allProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await productService.allProducts();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all products successfully",
        data: result,
    })
})

// ............................................... Single Product .......................................................................

const singleProduct = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await productService.getSingleProduct(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single product successfully",
        data: result,
    })
})

export const productController = { createProduct, allProducts, singleProduct };