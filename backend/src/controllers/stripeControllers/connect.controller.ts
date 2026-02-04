import { asyncHandler, logger, sendRedirect, sendResponse } from "../../handlers/handler";
import stripeService from "../../services/payment/stripe.connect";
import {Request,Response} from "express";


export const onboardSeller = asyncHandler( async (req:Request,res:Response) => {
   const {email} = req.body;
   const account = await stripeService.createConnectedAccount(email);
   logger("INFO","User Account",account);
   const onboardingUrl = await stripeService.createAccountLink(account.id);
   logger("INFO","On Boarding Url",onboardingUrl);
    return sendRedirect(res,onboardingUrl)
});

export const onboardingSuccessRedirect = asyncHandler(async (req: Request, res: Response) => {

    const { accountId } = req.params;
    return sendResponse(res,200, "Your Seller Account has been Successfully Created")

    // Redirect to Frontend Url

            // return res.redirect(
            //     `http://localhost:3000/onboarding/success?accountId=${accountId}`
            // );
})

export const refreshOnBoarding = asyncHandler(async (req:Request,res:Response)  => {
    const { accountId } = req.params;
    if (typeof accountId =="string"){
        const link = await stripeService.createAccountLink(accountId);
        return sendResponse(res,200,"Account Refreshed Successfully", {onBoarding:link})
    }
    return sendResponse(res,400,"Invalid AccountId Type")
})

export const getAccountStatus = asyncHandler(async (req:Request,res:Response) => {
    const {accountId}= req.params;
    if (typeof accountId =="string"){
        const status = await stripeService.getAccountStatus(accountId);
        return sendResponse(res,200,"Account Status",status);
    }
    return sendResponse(res,400,"Invalid AccountId Type")
    
});

export const createPaymentIntent = asyncHandler(async (req:Request,res:Response) => {
    const {amount,currency } = req.body;
    const data = await stripeService.createPayment(amount,currency);
    logger("INFO","Payment Intent Object",data);
    return sendResponse(res,200,"Payment Intent Object",data);
})

export const createPaymentTransfer = asyncHandler(async (req:Request,res:Response) => {
    const {amount,currency,destinationAccountId} = req.body;

    const transfer = await  stripeService.createTransfer(amount,currency,destinationAccountId)
    return sendResponse(res,200,"Transfer created successfully",transfer)
})


const stripeConnectController = {
    onboardSeller, 
    onboardingSuccessRedirect,
    refreshOnBoarding,
    getAccountStatus,
    createPaymentTransfer,
    createPaymentIntent,

}

export default stripeConnectController;
