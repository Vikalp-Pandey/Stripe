import stripeConnectController from "@/controllers/stripeControllers/connect.controller";
import paymentController from "@/controllers/stripeControllers/payment.controller";
import { Router } from "express";

const router = Router();


router.get('/checkout-payment',paymentController.checkoutSession);
router.get('/success',paymentController.successResponse);
router.get('/cancelled',paymentController.cancelResponse);

// Route for Account Creation For Sellers
router.post("/connect/onboard", stripeConnectController.onboardSeller);

// Route for getting Success page after cofirming the Account Creation
router.get("/onboarding/success/:accountId",stripeConnectController.onboardingSuccessRedirect)

// Route for refreshing the seller account
router.get("/connect/refresh/:accountId",stripeConnectController.refreshOnBoarding)

// Route for getting the seller account status
router.get("/connect/status/:accountId",stripeConnectController.getAccountStatus)


//^ For Making Payments

// For Initializing a payment for customer and capturing money
router.post("/create-payment",stripeConnectController.createPaymentIntent)

// For Transferring money to seller account
router.post("/transfer",stripeConnectController.createPaymentTransfer)
export default router;


