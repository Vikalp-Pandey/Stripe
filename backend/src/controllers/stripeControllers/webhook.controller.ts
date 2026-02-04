import env from "../../env";
import { asyncHandler, logger, sendResponse } from "../../handlers/handler";
import {Request,Response} from "express";
import {stripe} from "../../services/payment/stripe";

export const webhooks = asyncHandler(async(req:Request,res:Response)=>{
    const sig = req.headers['stripe-signature']

    if(!sig){
        return sendResponse(res,400,"Stripe Signature Not Found");
    }

    let event;

    event = stripe.webhooks.constructEvent(req.body,  sig, env.STRIPE_WEBHOOK_SECRET)

    switch(event.type){
        // Webhook on Session Completion
        case "checkout.session.completed" : {
            const session = event.data.object;
            logger("INFO","Webhook_Session",session)
            logger("INFO","Webhook_Message ", "Checkout Session Completed")
            break;
        }
         
        case "payment_intent.succeeded" : {
            logger("INFO","Webhook_Message","Payment completed successfully")
            break;
        }

        default:
            logger("INFO", "Unhandled_Event", event.type);
    
    }

    return sendResponse(res,200,"Response: ",{recieved:true})
});

const webhookController = {
    webhooks
}
export default webhookController;



