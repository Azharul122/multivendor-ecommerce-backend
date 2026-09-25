import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { planService } from "./plan.service";
import sendResponse from "../../utils/sendResponse";


const createNewPlan = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body

        const result = planService.createNewPlan(payload)

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Plan created successfully",
        data: result,
    })
    }
)

const getAllPlan = catchAsync(
    async (req: Request, res: Response) => {
        const result = planService.getAllPlans()

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all plan successfully",
            data: result,
        })
    }
)

const getSinglePlan = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = planService.getSinglePlan(id as string)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get single plan successfully",
            data: result,
        })
    }
)

const updatePlan = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body
        const result = planService.updatePlan(id as string, payload)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Plan updated successfully",
            data: result,
        })
    }
)

const deletePlan = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = planService.deletePlan(id as string)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Plan deleted successfully",
            data: result,
        })
    }
)


export const planController= {
    createNewPlan,
    getAllPlan,
    getSinglePlan,
    updatePlan,
    deletePlan
}