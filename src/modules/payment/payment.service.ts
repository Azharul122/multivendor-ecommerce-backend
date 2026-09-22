
// .......................... Create Payment Intent ..............................

import { stripe } from "../../configs/stripe.config";

const createPaymentIntent = async (amount: number) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent;
}


// .......................... Payment Now  .............................

const paymentNow = async (paymentIntentId: string) => {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
}


export const paymentService = { createPaymentIntent, paymentNow }