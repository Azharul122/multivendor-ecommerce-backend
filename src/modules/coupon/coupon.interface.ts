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
  productIds?: string[]; 
}

 interface IApplyCouponPayload {
  code: string;
  items: { productId: string; price: number; quantity: number }[];
}

export { ICouponPayload,IApplyCouponPayload };