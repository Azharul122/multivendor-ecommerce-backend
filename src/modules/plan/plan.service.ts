import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IPlanPayload } from "./plan.interface";



const createNewPlan = async (payload: IPlanPayload) => {
    // check id same name
    const isSameNameExist = await prisma.plan.findFirst({
        where: {
            name: payload.name
        }
    })

    if (isSameNameExist) {
        throw new AppError(status.CONFLICT, "Plan already exist with this name try another")
    }

    const result = await prisma.plan.create({
        data: payload
    })
    return result

}

// admin route

const getAllPlans = async () => {
    const result = await prisma.plan.findMany(

    )
    return result
}

const getSinglePlan = async (id: string) => {
    const result = await prisma.plan.findUnique({
        where: {
            id
        }
    })
    return result
}

const updatePlan = async (id: string, payload: IPlanPayload) => {
    const result = await prisma.plan.update({
        where: {
            id
        },
        data: payload
    })
    return result
}

const deletePlan = async (id: string) => {
    const result = await prisma.plan.update({
        where: {
            id
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
    return result
}


export const planService = { createNewPlan, getAllPlans, getSinglePlan, updatePlan, deletePlan }