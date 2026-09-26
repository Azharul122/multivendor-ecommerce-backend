import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { ca } from "zod/v4/locales";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const result = await paymentService.createPaymentIntent(orderId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.query as { paymentIntentId: string };
    const result = await paymentService.verifyPayment(paymentIntentId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  try {
    const event = paymentService.constructWebhookEvent(
      req.body,
      signature
    );


    await paymentService.handleStripeWebhookEvent(event);
    // await refundService.handleRefundWebhookEvent(event);

    res.status(200).json({ received: true });
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};



const purchaseSubscription = catchAsync(async (req: Request, res: Response) => {
  const { userId, planId } = req.body;
  const result = await paymentService.purchaseSubscription(userId, planId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription created successfully",
    data: result,
  })
});

export const paymentController = {
  createPaymentIntent,
  verifyPayment,
  stripeWebhook,
  purchaseSubscription
};