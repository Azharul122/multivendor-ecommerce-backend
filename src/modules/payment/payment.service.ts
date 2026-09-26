import Stripe from "stripe";
import { stripe } from "../../configs/stripe.config";
import { prisma } from "../../lib/prisma";
import { IPaymentIntentResponse, ISubscriptionIntentResponse, IVerifyPaymentResponse } from "./payment.interface";




const createPaymentIntent = async (
  orderId: string
): Promise<IPaymentIntentResponse> => {
  const order = await prisma.order.findFirstOrThrow({
    where: { id: orderId, isDeleted: false },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100), 
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id },
  });


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

// .......................... Verify Payment  ..........

const verifyPayment = async (
  paymentIntentId: string
): Promise<IVerifyPaymentResponse> => {
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return {
    status: intent.status,
    orderId: intent.metadata.orderId,
  };
};

// .......................... Stripe Webhook Handler  ..............

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

// Subscriptions

const getOrCreateStripeCustomer = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
 
  if (user.stripeCustomerId) return user.stripeCustomerId;
 
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { userId: user.id },
  });
 
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });
 
  return customer.id;
};

const purchaseSubscription = async (
  userId: string,
  planId: string
): Promise<ISubscriptionIntentResponse> => {
  const plan = await prisma.plan.findFirstOrThrow({
    where: { id: planId, isDeleted: false },
  });
 
  if (!plan.stripePriceId) {
    throw new Error("Price not set for this plan");
  }
 
  const customerId = await getOrCreateStripeCustomer(userId);
 
  const stripeSubscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: plan.stripePriceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata: { userId, planId },
  });
 
  const invoice = stripeSubscription.latest_invoice as Stripe.Invoice & {
    payment_intent?: string | Stripe.PaymentIntent | null;
  };
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
  const subscriptionItem = stripeSubscription.items.data[0];
 
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId,
      priceAtSubscription: plan.price,
      status: "incomplete", 
      autoRenew: true,
      startDate: new Date(subscriptionItem.current_period_start * 1000),
      endDate: new Date(subscriptionItem.current_period_end * 1000),
      stripeSubscriptionId: stripeSubscription.id,
    },
  });
 
  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret as string,
  };
};

export const paymentService = {
  createPaymentIntent,
  verifyPayment,
  constructWebhookEvent,
  handleStripeWebhookEvent,
  purchaseSubscription,
};