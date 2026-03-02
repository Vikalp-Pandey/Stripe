import env from '../../env';
import { asyncHandler, logger, sendResponse } from '../../handlers/handler';
import { Request, Response } from 'express';
import { stripe } from '../../services/payment/stripe';
import PlanHistory from '../../models/stripeModels/subscription.model';


export const webhooks = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    return sendResponse(res, 400, 'Stripe Signature Not Found');
  }

  let event;

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  
  logger("INFO", "Stripe_Webhook_Received", {
              type: event.type,
              id: event.id,
      });

  switch (event.type) {
    //  Checkout session completed or Invoice.paid
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      console.log('--------------------------------------------------------------------------------------------------------------'      )      
      console.log(session);
      

      logger('INFO', 'Webhook_Session', {
        id: session.id,
        amount: session.amount_total,
        metadata: session.metadata,
      });

      logger('INFO', 'Webhook_Message', 'Checkout Session Completed');

      const { userId, planId, planName, durationDays } = session.metadata;

      if (!userId || !planId) {
        logger('ERROR', 'Webhook_Metadata_Missing', session.metadata);
        break;
      }

      // 🛑 Idempotency check (VERY IMPORTANT)
      const alreadyExists = await PlanHistory.findOne({
        stripeSessionId: session.id,
      });

      if (alreadyExists) {
        logger('INFO', 'Webhook_Duplicate_Event', session.id);
        break;
      }

      const startedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(durationDays ?? 30));

      await PlanHistory.create({
        userId,
        planId,
        planName,
        amount: session.amount_total,
        currency: session.currency,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        startedAt,
        expiresAt,
        status: 'active',
      });

      logger('INFO', 'Plan_Activated', {
        userId,
        planId,
        expiresAt,
      });

      break;
    }

  case 'invoice.paid': {

    // Invoice Paid Session is different checkout session structure wise.
      const invoice = event.data.object as any;
      console.log(invoice);
      
      
      // 1. Extract metadata from the correct deep path
      const subMetadata = invoice.parent?.subscription_details?.metadata;

      // logger('INFO', 'Webhook_Invoice_Details', {
      //   id: invoice.id,
      //   amount: invoice.amount_paid, // Use amount_paid for Invoices
      //   metadata: subMetadata,
      // });

      if (!subMetadata || !subMetadata.userId) {
        logger('ERROR', 'Webhook_Metadata_Missing', { 
          invoiceId: invoice.id, 
          pathFound: !!subMetadata 
        });
        break;
      }

      const { userId, planId, planName, durationDays } = subMetadata;
      // logger("INFO","Extracted User from Invoice Details: ",{ userId, planId, planName, durationDays })

      
      // 2. Idempotency check 
      const alreadyExists = await PlanHistory.findOne({
        stripeSessionId: invoice.id,
      });
     
      if (alreadyExists) {
        logger('INFO', 'Webhook_Duplicate_Event', invoice.id);
        break;
      }
      // logger('INFO', 'No Duplicate Event', invoice.id);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(durationDays ?? 30));


      // 3. Save to DB
      try{
      await PlanHistory.create({
        userId,
        planId,
        planName,
        amount: invoice.amount_paid, // Use amount_paid
        currency: invoice.currency,
        stripeSessionId: invoice.id,
        stripePaymentIntentId: invoice.payment_intent || invoice.charge || `inv_${invoice.id}`,
        startedAt: new Date(),
        expiresAt,
        status: 'active',
      });
    }catch(error:any){
      logger("ERROR","Error in creating Subscription:",error)
      break;
    }
      logger('INFO', 'Plan_Activated_via_Invoice', { userId, planId });
      break;
  }


    //: payment intent success
    // case 'payment_intent.succeeded': {
    //   const payment_intent = event.data.object as any;
    //   // console.log(payment_intent)
    //   // logger('INFO', 'Webhook_Message', 'Payment Intent Succeeded');
    //   break;
    // }

    default:
      // logger('INFO', 'Unhandled_Event', event.type);
  }

  //  Stripe requires a 200 response
  return sendResponse(res, 200, 'Recieved Message');
});

const webhookController = {
  webhooks,
};

export default webhookController;
