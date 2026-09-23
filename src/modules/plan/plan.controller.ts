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


export const planController= {
    createNewPlan
}