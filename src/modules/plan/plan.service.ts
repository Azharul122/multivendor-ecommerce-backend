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


export const planService = { createNewPlan }