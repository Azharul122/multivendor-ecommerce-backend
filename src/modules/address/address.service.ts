import { prisma } from "../../lib/prisma";


const createAddress = async (payload: IAddress) => {
    const result = await prisma.address.create({ data: payload });
    return result;
}