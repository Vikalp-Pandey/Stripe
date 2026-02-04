import env from "@/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2026-01-28.clover",
  }
);

export const createSessionUrl = async () => {
  const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price: 'price_1SsLXvK6NCtggyau3FKpalUo',
      quantity: 1,
    },
  ],

    mode: 'subscription',
    success_url:`${env.BASE_BACKEND_URL}/api/payment/success`,
    cancel_url:`${env.BASE_BACKEND_URL}/api/payment/cancelled`

  });
  
  console.log(session.success_url);
  console.log(session);
  
  return session.url
}

const paymentService = {
    createSessionUrl
}
export default paymentService;