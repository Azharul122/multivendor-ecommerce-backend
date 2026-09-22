import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { addressService } from "./address.service";
import { IRequestUser } from "../../types/user";
import sendResponse from "../../utils/sendResponse";

const createAddress = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user as IRequestUser
    const result = await addressService.createAddress(user, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Address created successfully",
        data: result,
    })
})

export const addressController = { createAddress }