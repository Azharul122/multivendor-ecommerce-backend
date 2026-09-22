import Stripe from "stripe";
import { stripe } from "../../configs/stripe.config";
import { prisma } from "../../lib/prisma";
import { IPaymentIntentResponse, IVerifyPaymentResponse } from "./payment.interface";


// .......................... Create Payment Intent ..............................
// card / Google Pay / Apple Pay - সবগুলোই automatic_payment_methods এর মাধ্যমে
// একই PaymentIntent থেকে হ্যান্ডেল হবে, আলাদা লজিক লাগবে না। Wallet দুটো
// browser + domain support অনুযায়ী ফ্রন্টএন্ডে নিজে থেকেই শো করবে।

const createPaymentIntent = async (
  orderId: string
): Promise<IPaymentIntentResponse> => {
  const order = await prisma.order.findFirstOrThrow({
    where: { id: orderId, isDeleted: false },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100), // Stripe amount নেয় smallest unit-এ (cents)
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id },
  });

  // প্রতিটা attempt-এর জন্য একটা pending payment record রাখছি,
  // status webhook থেকে succeeded/failed এ update হবে
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.totalAmount,
      paymentMethod: "stripe",
      status: "pending",
    },
  });

  return {
    clientSecret: paymentIntent.client_secret as string,
    paymentIntentId: paymentIntent.id,
  };
};

// .......................... Verify Payment (frontend redirect page থেকে কল হবে) ..........

const verifyPayment = async (
  paymentIntentId: string
): Promise<IVerifyPaymentResponse> => {
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return {
    status: intent.status,
    orderId: intent.metadata.orderId,
  };
};

// .......................... Stripe Webhook Handler (source of truth) ..............

const constructWebhookEvent = (rawBody: Buffer, signature: string) => {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
};

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;

      await prisma.payment.updateMany({
        where: { orderId, isDeleted: false, status: "pending" },
        data: {
          status: "succeeded",
          isVerified: true,
          paymentMethod: intent.payment_method_types?.[0] ?? "stripe",
        },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;

      await prisma.payment.updateMany({
        where: { orderId, isDeleted: false, status: "pending" },
        data: { status: "failed" },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAYMENT_FAILED" },
      });
      break;
    }

    default:
      break;
  }
};

export const paymentService = {
  createPaymentIntent,
  verifyPayment,
  constructWebhookEvent,
  handleStripeWebhookEvent,
};