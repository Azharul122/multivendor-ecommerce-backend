import { Coupon } from "../genereted/prisma/client";

const round2 = (n: number) => Math.round(n * 100) / 100;

const calculateDiscount = (
  coupon: Pick<Coupon, "discountType" | "discountValue" | "maxDiscountAmount">,
  eligibleAmount: number,
) => {
  let discount =
    coupon.discountType === "PERCENTAGE"
      ? (eligibleAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.discountType === "PERCENTAGE" && coupon.maxDiscountAmount != null) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  discount = Math.min(discount, eligibleAmount);
  return round2(discount);
};

export { round2, calculateDiscount };