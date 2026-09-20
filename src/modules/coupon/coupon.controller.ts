import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CouponService } from "./coupon.service";
import sendResponse from "../../utils/sendResponse";

const couponController = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await CouponService.createCoupon(payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Coupon created successfully",
        data: result,
    })
})

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await CouponService.applyCoupon(payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Coupon applied successfully",
        data: result,
    })
})

export const couponControllers = { couponController, applyCoupon }