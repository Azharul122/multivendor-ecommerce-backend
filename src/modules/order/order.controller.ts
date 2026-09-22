import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { orderService } from "./order.service";
import { paymentService } from "../payment/payment.service";
import sendResponse from "../../utils/sendResponse";


const createNewOrder= catchAsync(async (req: Request, res: Response) => {
    const order = await orderService.addNewOrder(req.body);
    const payment = await paymentService.createPaymentIntent(order?.id);
 
    res.status(201).json({
      success: true,
      data: { order, payment },
    });
})

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await orderService.getOrderById(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all order successfully",
        data: result,
    })
})

const getOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await orderService.getOrders();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get all order successfully",
        data: result,
    })
})

export const orderController = { createNewOrder, getOrderById, getOrders }