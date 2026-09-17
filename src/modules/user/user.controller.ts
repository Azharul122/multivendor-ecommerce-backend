import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";



const register = catchAsync(
    async (req: Request, res: Response) => {
        const { name, email, password, role } = req.body;

        const result = await userService.register({ name, email, password, role });

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User created successfully",
            data: result,
        });
    }
)

const login = catchAsync(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const result = await userService.login(email, password);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged in successfully",
            data: result,
        });
    }
)

// .............................................. Verify Email ........................................................................

const verifyEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;

        const result = await userService.verifyEmail(email, otp)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Email verified successfully",
            data: result,
        });
    }
)

// .............................................. Reset Password .......................................................................

// ............................................... Forgot Password .......................................................................

const forgotPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const result = await userService.forgotPassword(email)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Password reset link sent successfully",
            data: result,
        })
    }
)

// ............................................... Change Password .......................................................................



export const userController = { register, login, verifyEmail };