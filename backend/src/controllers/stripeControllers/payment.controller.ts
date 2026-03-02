import {
  asyncHandler,
  logger,
  sendRedirect,
  sendResponse,
} from '../../handlers/handler';
import paymentService from '../../services/payment/stripe';
import { Request, Response, NextFunction } from 'express';
import PlanHistory from '../../models/stripeModels/subscription.model';
import env from '../../env';
import jwtService from '../../services/auth/jwt.service';
import { findInstance } from '../../services/common.service';

export const checkoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token = req.cookies.accessToken;
  const user = req.user;
  if(!user){
    return sendResponse(res,401,"User Not Found")
  }
  
  const hasPlan = await findInstance(PlanHistory,"userId",user.id)

  if(hasPlan && hasPlan.length > 0 ){
    return sendResponse(res,400,"User Already has a Plan", hasPlan)
  }

  const sessionUrl = await paymentService.createSessionUrl(user.id);
  if (!sessionUrl) {
    return sendResponse(res,404,"Session Url not Found")
  }

  return sendResponse(res,200,"Session Url", { url: sessionUrl })
};

export const successResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return sendRedirect(res, `${env.ALLOWED_ORIGINS}/plans`);
};
export const cancelResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return sendResponse(res,402,"Payment Cancelled",{ Detail: 'Payment Cancelled' });
};

export const getUserPlan = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  console.log(token);
  
  const user = req.user
  console.log(user);
  
  if (!user) {
    return sendResponse(res, 404, 'User Not Found for Plan Summary');
  }

  const userId = await jwtService.extractUser(token);
  
  const plans = await paymentService.findUserPlans(userId);
  return sendResponse(res, 200, 'User Plan History', plans);
});

const paymentController = {
  checkoutSession,
  successResponse,
  cancelResponse,
  getUserPlan,
};

export default paymentController;
