import env from "@/env";
import { asyncHandler, logger, sendResponse } from "@/handlers/handler";
import { accountType } from "@/models/authModels/user.model";
import jwtService from "@/services/auth/jwt.service";
import userService from "@/services/auth/user.service";
import { Request,Response,NextFunction } from "express";

export const signupUser = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {
   const {name,email,password} = req.body;
   const isExisting = await userService.findUser(email);
   if(isExisting){
    return sendResponse(res,400,"User with email already exists.")
   }
   const newUser = await userService.createUser({name,email,password,accountType:accountType.Local})
   const accessToken = await jwtService.signJwt({id: newUser._id.toString()}, env.ACCESS_SECRET,{expiresIn:'7d'});
   return sendResponse(res,200,"User SignedUp Successfully", {newUser,accessToken})
})

export const signinUser = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {
    const {email,password} = req.body;
    const registeredUser = await userService.findUser({email})
    logger("INFO","Registered User: ",registeredUser)
    if(!registeredUser){
        return sendResponse(res,400,"User Not Signed Up")
    }
    const accessToken = await jwtService.findandreissueToken(email);
    return sendResponse(res,200,"User Signed In Successfully",{registeredUser,accessToken})
})

const jwtAuthController = {
    signupUser,
    signinUser
}
export default jwtAuthController;
