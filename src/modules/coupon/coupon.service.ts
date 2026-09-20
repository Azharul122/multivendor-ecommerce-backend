import { prisma } from "../../lib/prisma"

import { AppError } from "../../errors/AppError";
import { ICouponPayload } from "./coupon.interface";
import { Coupon } from "../../genereted/prisma/client";

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


export const CouponService = { createCoupon };