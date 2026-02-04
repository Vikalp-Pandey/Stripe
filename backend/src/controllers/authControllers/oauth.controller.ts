import { asyncHandler, logger, sendRedirect, sendResponse } from "../../handlers/handler";
import oauthService from "../../services/auth/oauth.service";
import userService from "../../services/auth/user.service";

import { Request,Response,NextFunction } from "express";


export const getGithubURL = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const githubOauthUrl = await oauthService.getGithubURL();
    logger("INFO","GithubOauthURL:",githubOauthUrl)
    return sendRedirect(res,githubOauthUrl)
})

export const signinwithGithub = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {code}= req.query;
    
    if(typeof code == "string")
        {
            const user = await oauthService.signinwithGithub(code)
            const newUser = await userService.createUser(user)
            // return sendResponse(res,200,"User Signed In Successfully",newUser)
            return sendRedirect(res,"http://localhost:5174/payement")
        }
    return sendResponse(res,400,"Invalid Code Type",{
        code: typeof code
    })
})

export const getGoogleURL = async(req:Request,res:Response,next:NextFunction)=>{
   const googleOauthUrl = await oauthService.getGoogleURL()
   logger("INFO","Google Url",googleOauthUrl)
   return sendRedirect(res,googleOauthUrl)
}

export const signinwithGoogle = async (req:Request,res:Response,next:NextFunction)=>{
    const {code}=req.query

    if(typeof code=="string"){
       const user = await oauthService.signinwithGoogle(code);
       logger("INFO","User: ",user)
    //    return sendResponse(res,200,"User signed in successfully",user)
       return sendRedirect(res,"http://localhost:5174/payement")
    }
    return sendResponse(res,400,"Invalid Code Type",{
        code: typeof code
    })
}
export const signwithGoogle = async()=>{

};

const oauthController = {
    getGithubURL,
    signinwithGithub,
    getGoogleURL,
    signinwithGoogle
}

export default oauthController;
