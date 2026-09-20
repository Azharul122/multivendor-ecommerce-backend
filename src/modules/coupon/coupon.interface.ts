import { CouponScope, DiscountType } from "../../genereted/prisma/enums";


 interface ICouponPayload {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  scope: CouponScope;
  minOrderAmount?: number;
  usageLimit?: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive?: boolean;
  productIds?: string[]; // scope PRODUCT hole required
}

export { ICouponPayload }