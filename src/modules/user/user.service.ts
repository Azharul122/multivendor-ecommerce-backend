

//  ............................ Register ............................

import status from "http-status";
import { AppError } from "../../errors/AppError";
import { Role, UserStatus } from "../../genereted/prisma/browser";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserRegister } from "./user.schema";
import { getAccessToken, getRefreshToken } from "../../utils/token";

const register = async (payload: UserRegister) => {

    const isAlreadyExist = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })

    if (isAlreadyExist) {
        throw new AppError(status.BAD_REQUEST, "User Already exist")
    }
    try {
        const result = await auth.api.signUpEmail({
            body: {
                name: payload.name,
                email: payload.email,
                password: payload.password,
                role: payload.role as Role,
            },
        });

        if (!result.user) {
            throw new Error("User not created");
        }

        if (payload.role === Role.SELLER) {
            await prisma.seller.create({
                data: {
                    userId: result.user.id,
                    name: payload.name,
                    email: payload.email,
                    role: Role.SELLER,
                },
            });
        }

        return result;
    } catch (error) {
        console.error("User register error:", error);
        throw error;
    }
};

// ............................ login ............................

const login = async (email: string, password: string) => {

    const isAlreadyDeletedUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (isAlreadyDeletedUser?.emailVerified === false) throw new Error("Please verify your email first before logging in, check your email for verification")
    if (isAlreadyDeletedUser?.isDeleted) throw new Error("User is already deleted")
    if (isAlreadyDeletedUser?.status === "BLOCKED") throw new Error("User is blocked, please contact with the admin")

    const result = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    // if password need to change true then make it false

    if (result.user.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: result.user.id
            },
            data: {
                needPasswordChange: false
            }
        })
    }

    // console.log(result)

    const accessToken = await getAccessToken({
        id: result.user.id,
        role: result.user.role,
        name: result.user.name,
        isDeleted: result.user.isDeleted,
        email: result.user.email,
        status: result.user.status,
        emailVerified: result.user.emailVerified
    })

    const refreshToken = await getRefreshToken({
        id: result.user.id,
        role: result.user.role,
        name: result.user.name,
        isDeleted: result.user.isDeleted,
        email: result.user.email,
        status: result.user.status,
        emailVerified: result.user.emailVerified
    })

    // console.log(accessToken, refreshToken)



    return {
        ...result,
        accessToken,
        refreshToken
    }
}

//  ............................ Verify Email ............................

const verifyEmail = async (email: string, otp: string) => {


    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })

    if (result.status && !result.user?.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }
        })
    }


    return result
}

// ............................ Reset Password ............................

// ............................ Forgot Password ............................
const forgotPassword = async (email: string) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found")
    }

    if (!isUserExists.emailVerified) {
        throw new AppError(status.FORBIDDEN, "Email not verified")
    }

    if (isUserExists.isDeleted || isUserExists.status === "BLOCKED") {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "You can't chnage password please contact with admin")
    }
    const result = await auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    })
    return result
}

// ............................ Change Password ............................


export const userService = { register, login, verifyEmail, forgotPassword };