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

const getAllAddress= async (user: any) => {
    const userInfo = await prisma.user.findUnique({ where: { id: user.id } }) as User;
    if (!user) throw new AppError(status.NOT_FOUND, "User not found");
    const result = await prisma.address.findMany({ where: { userId: userInfo.id } });
    return result;
}

const getSingleAddress = async (id: string) => {
    const result = await prisma.address.findUnique({ where: { id } });
    return result;
}

const updateAddress = async (id: string, payload: IAddressPayload) => {
    const result = await prisma.address.update({ where: { id }, data: { ...payload } });
    return result;
}

const deleteAddress = async (id: string) => {
    const result = await prisma.address.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
    return result;
}



export const addressService = { createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress }