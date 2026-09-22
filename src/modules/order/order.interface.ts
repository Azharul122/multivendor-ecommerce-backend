export interface IOrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrderPayload {
  userId: string;
  sellerId: string;
  totalAmount: number;
  shippingAddressId: string;
  billingAddressId: string;
  products: IOrderProduct[];
}