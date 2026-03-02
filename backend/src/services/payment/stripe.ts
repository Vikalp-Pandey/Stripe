import env from '../../env';
import Stripe from 'stripe';
import PlanHistory from "../../models/stripeModels/subscription.model";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

export const createSessionUrl = async (userId: string) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: env.PRICE_ID,
        quantity: 1,
      },
    ],

    mode: 'subscription',
    success_url: `${env.BASE_BACKEND_URL}/api/payment/success`,
    cancel_url: `${env.BASE_BACKEND_URL}/api/payment/cancelled`,
    metadata: {
      userId: userId,
      planId: 'pro_monthly',
      planName: 'Pro Plan',
      durationDays: '30',
    },
    subscription_data: {
    // This is the key! This makes metadata available in invoice.paid
    metadata: {
      userId: userId,
      planId: 'pro_monthly',
      planName: 'Pro Plan',
      durationDays: '30',
    }
  }

});

  // console.log(session.success_url);
  // console.log(session);
  return session.url;
};


const findUserPlans = async (userId:string)=>{
  const now = new Date();

    // 1. Query the database directly
    const activePlans = await PlanHistory.find({
      userId: userId,
      // Logic: Plan is only active if it hasn't expired yet
      expiresAt: { $gt: now }, 
      // AND it hasn't been manually marked as cancelled in the DB
      status: { $ne: 'cancelled' }
    }).sort({ expiresAt: -1 }); // Newest expiration first

  return activePlans
}

const paymentService = {
  createSessionUrl,
  findUserPlans
};
export default paymentService;
