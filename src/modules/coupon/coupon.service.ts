import { prisma } from "../../lib/prisma"

import { AppError } from "../../errors/AppError";
import { IApplyCouponPayload, ICouponPayload } from "./coupon.interface";
import { Coupon } from "../../genereted/prisma/client";
import { calculateDiscount, round2 } from "../../utils/coupon";

// ............................. Create Coupon ..............................


const createCoupon = async (payload: ICouponPayload) => {
    const { productIds = [], code, startDate, endDate, ...rest } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
        throw new AppError(400, "End date must be after start date");
    }
    if (rest.discountValue <= 0) {
        throw new AppError(400, "Discount value must be greater than 0");
    }
    if (rest.discountType === "PERCENTAGE" && rest.discountValue > 100) {
        throw new AppError(400, "Percentage discount cannot exceed 100");
    }
    if (rest.maxDiscountAmount !== undefined) {
        if (rest.discountType !== "PERCENTAGE") {
            throw new AppError(400, "Max discount amount is only allowed for percentage coupons");
        }
        if (rest.maxDiscountAmount <= 0) {
            throw new AppError(400, "Max discount amount must be greater than 0");
        }
    }
    if (rest.scope === "PRODUCT" && productIds.length === 0) {
        throw new AppError(400, "Product scope coupon requires at least one product");
    }
    if (rest.scope === "CART" && productIds.length > 0) {
        throw new AppError(400, "Cart scope coupon cannot have products");
    }

    const normalizedCode = code.trim().toUpperCase();


    const existing = await prisma.coupon.findUnique({ where: { code: normalizedCode } });
    if (existing) {
        throw new AppError(409, "Coupon code already exists");
    }

    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length > 0) {
        const count = await prisma.product.count({ where: { id: { in: uniqueProductIds } } });
        if (count !== uniqueProductIds.length) {
            throw new AppError(404, "One or more products not found");
        }
    }

    return prisma.coupon.create({
        data: {
            ...rest,
            code: normalizedCode,
            startDate: start,
            endDate: end,
            products: {
                create: uniqueProductIds.map((productId) => ({ productId })),
            },
        },
        include: { products: true },
    });
};

const applyCoupon = async (payload: IApplyCouponPayload) => {
    const { items } = payload;

    if (items.length === 0) {
        throw new AppError(400, "Cart is empty");
    }

    const code = payload.code.trim().toUpperCase();

    const coupon = await prisma.coupon.findFirst({
        where: { code, isDeleted: false },
        include: { products: { select: { productId: true } } },
    });

    if (!coupon || !coupon.isActive) {
        throw new AppError(404, "Invalid coupon code");
    }

    const now = new Date();
    if (now < coupon.startDate) {
        throw new AppError(400, "Coupon is not active yet");
    }
    if (now > coupon.endDate) {
        throw new AppError(400, "Coupon has expired");
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError(400, "Coupon usage limit reached");
    }

    const subTotal = round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0));

    if (coupon.minOrderAmount !== null && subTotal < coupon.minOrderAmount) {
        throw new AppError(400, `Minimum order amount is ${coupon.minOrderAmount}`);
    }

    let eligibleAmount = subTotal;

    if (coupon.scope === "PRODUCT") {
        const allowedIds = new Set(coupon.products.map((p) => p.productId));
        eligibleAmount = round2(
            items
                .filter((i) => allowedIds.has(i.productId))
                .reduce((sum, i) => sum + i.price * i.quantity, 0),
        );

        if (eligibleAmount === 0) {
            throw new AppError(400, "Coupon is not applicable to any item in your cart");
        }
    }

    const discount = calculateDiscount(coupon, eligibleAmount);

    return {
        couponId: coupon.id,
        code: coupon.code,
        scope: coupon.scope,
        discountType: coupon.discountType,
        subTotal,
        eligibleAmount,
        discount,
        totalAfterDiscount: round2(subTotal - discount),
    };
};



export const CouponService = { createCoupon, applyCoupon };