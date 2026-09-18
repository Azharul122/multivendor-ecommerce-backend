import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import envConfig from "../../configs/envConfig";
import { auth } from "../../lib/auth";
import { setBetterAuthSessionToCookie, setRefreshTokenToCookie } from "../../utils/token";
import { setAccessTokenToCookie } from "../../utils/token";
import status from "http-status";
import { IRequestUser } from "../../types/user";


// ............................ register ............................
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

// ............................ login ............................
const login = catchAsync(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const result = await userService.login(email, password);

        const { accessToken, refreshToken, token, ...rest } = result

        setAccessTokenToCookie(res, accessToken)
        setRefreshTokenToCookie(res, refreshToken)
        setBetterAuthSessionToCookie(res, token)

        sendResponse(res, {
            message: "User logged in successfully",
            success: true,
            statusCode: 200,
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
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

const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, password } = req.body;

        const result = await userService.resetPassword(email, otp, password)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Password reset successfully",
            data: result,
        })
    }
)

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

// ............................................... Google Login .......................................................................

const googleLogin = catchAsync((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL: callbackURL,
        betterAuthUrl: envConfig.BETTER_AUTH_URL,
    })
})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if (!sessionToken) {
        return res.redirect(`${envConfig.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers: {
            "Cookie": `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_session_found`);
    }


    if (session && !session.user) {
        return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_user_found`);
    }

    const result = await userService.googleLoginSuccess(session);

    const { accessToken, refreshToken } = result;

    setAccessTokenToCookie(res, accessToken);
    setRefreshTokenToCookie(res, refreshToken);
    // ?redirect=//profile -> /profile
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envConfig.FRONTEND_URL}${finalRedirectPath}`);
})

const handleOAuthError = catchAsync((req: Request, res: Response) => {
    const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envConfig.FRONTEND_URL}/login?error=${error}`);
})

// ............................................... Change Password .......................................................................

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
        const betterAuthSessionToken = req.cookies["betterAuth.session_token"];

        const result = await userService.changePassword(payload, betterAuthSessionToken);

        const { accessToken, refreshToken, token } = result;

        setAccessTokenToCookie(res, accessToken);
        setRefreshTokenToCookie(res, refreshToken);
        setBetterAuthSessionToCookie(res, token as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result,
        });
})

// ............................................... Logout .......................................................................

const logout = catchAsync(
    async (req: Request, res: Response) => {
        const sessionToken = req.cookies["better-auth.session_token"];

        if (!sessionToken) {
            return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_session_found`);
        }

        const session = await auth.api.getSession({
            headers: {
                "Cookie": `better-auth.session_token=${sessionToken}`
            }
        })

        if (!session) {
            return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_session_found`);
        }

        if (session && !session.user) {
            return res.redirect(`${envConfig.FRONTEND_URL}/login?error=no_user_found`);
        }

        const result = await userService.logout(session.user.id);

        res.clearCookie("better-auth.session_token");
        res.clearCookie("better-auth.refresh_token");

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Logout successfully",
            data: result,
        })
    }
)


// ............................................... Get My Profile .......................................................................

const getMyProfile = catchAsync(
    async (req: Request, res: Response) => {
        const userData = req.user

        const result = await userService.getMyProfile(userData as IRequestUser);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get my profile successfully",
            data: result,
        })
    }
)

export const userController = { register, login, verifyEmail, forgotPassword, resetPassword, changePassword, logout, googleLogin, googleLoginSuccess, handleOAuthError, getMyProfile };