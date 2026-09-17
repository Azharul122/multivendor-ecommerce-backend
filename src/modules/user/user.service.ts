

//  ............................ Register ............................

import { Role, UserStatus } from "../../genereted/prisma/browser";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserRegister } from "./user.schema";

const register = async (payload: UserRegister) => {

    const result = await auth.api.signUpEmail({
        body: {
            name: payload.name,
            email: payload.email,
            needPasswordChange: false,
            password: payload.password,
            role: Role.USER
        }
    })
    try {
        if (!result.user) throw new Error("User not created")

        const user = await prisma.user.create({
            data: {
                id: result.user.id,
                name: payload.name,
                email: payload.email,
                role: Role.PATIENT,
                status: UserStatus.ACTIVE,
                needPasswordChange: false,
                emailVerified: true,
                isDeleted: false,
                deletedAt: null,
            }
        })

        return {
            ...result,
            user
        }
    } catch (error) {
        console.log("user register error", error)
        await prisma.user.delete({
            where: {
                email: payload.email
            }
        })
        throw error
    }
}