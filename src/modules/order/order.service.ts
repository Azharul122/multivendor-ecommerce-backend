import { prisma } from "../../lib/prisma";
import { IOrderPayload } from "./order.interface";

const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const addNewOrder = async (payload: IOrderPayload) => {
    const { products, ...orderData } = payload;
    const totalAmount = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const result = await prisma.order.create({
        data: {
            ...orderData,
            totalAmount,
            orderNumber: generateOrderNumber(),
            status: "PENDING",
            products: {
                connect: products.map((p) => ({ id: p.productId })),
            },
        },
        include: { products: true },
    });

    return result;
};

const getOrderById = async (orderId: string) => {
    return prisma.order.findFirstOrThrow({
        where: { id: orderId, isDeleted: false },
        include: { products: true, payments: true },
    });
};

const getOrders = async () => {
    return prisma.order.findMany({ where: { isDeleted: false }, include: { products: true } });
};

export const orderService = { addNewOrder, getOrderById, getOrders };