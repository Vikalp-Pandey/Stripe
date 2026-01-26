
import paymentService from "@/services/payment/stripe";
import { Request,Response,NextFunction } from "express";

export const checkoutSession = async (req:Request,res:Response,next:NextFunction) => {
   const sessionUrl = await paymentService.createSessionUrl();
   if(!sessionUrl){
     return res.json({Error:"Session not found"})
   }
   res.redirect(sessionUrl);
}

export const successResponse = async (req:Request,res:Response,next:NextFunction)=>{
    return res.json({"Detail":"Successful Payment"});
}
export const cancelResponse = async (req:Request,res:Response,next:NextFunction)=>{
    return res.json({"Detail":"Payment Cancelled"});
}

const paymentController = {
    checkoutSession,
    successResponse,
    cancelResponse
}

export default paymentController;