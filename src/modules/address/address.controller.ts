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

const getAllAddress = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser
    const result = await addressService.getAllAddress(user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all address successfully",
        data: result,
    })
})

const getSingleAddress = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await addressService.getSingleAddress(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get single address successfully",
        data: result,
    })
})

const updateAddress = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await addressService.updateAddress(id as string, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Address updated successfully",
        data: result,
    })
})

const deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await addressService.deleteAddress(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Address deleted successfully",
        data: result,
    })
})

export const addressController = { createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress }