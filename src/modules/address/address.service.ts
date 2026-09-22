import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IAddressPayload } from "./address.interface";
import { User } from "../../genereted/prisma/client";


const createAddress = async (user: any, payload: IAddressPayload) => {
    const userInfo = await prisma.user.findUnique({ where: { id: user.id } }) as User;

    if (!user) throw new AppError(status.NOT_FOUND, "User not found");
    const result = await prisma.address.create({ data: { ...payload, userId: userInfo.id, phone: user.phone, name: user.name } });
    return result;
}



export const addressService = { createAddress }