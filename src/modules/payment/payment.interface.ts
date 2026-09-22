export type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled";

export interface ICreatePaymentIntentPayload {
  orderId: string;
}

export interface IPaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface IVerifyPaymentResponse {
  status: PaymentStatus | string;
  orderId: string;
}