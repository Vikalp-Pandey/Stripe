
import env from "@/env";
import { logger } from "@/handlers/handler";
import User from "@/models/authModels/user.model";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";


export const signJwt = async(payload: Object,jwt_secret:string,options:Object) => {
    const token =  jwt.sign(payload,jwt_secret,options)
    return token
} 

export const verifyJwt = async (token:string,jwt_secret:string) => {
    const decoded = jwt.verify(token,jwt_secret) 
    if (decoded) {
        return {decoded,expired:false}
    }
    return {decoded:null,expired:true}
}

export const findandreissueToken = async (email:string) => {
    const user = await User.findOne({email:email});
    const accessToken = user?.access_token;
    
    if(!accessToken && user){
       const token = await signJwt({id:user?._id.toString()},env.ACCESS_SECRET,{expiresIn: env.ACCESS_SECRET_TTL})
       logger("INFO","Access_Ttl:",env.ACCESS_SECRET_TTL)
        user.access_token = token
        await user.save()
       return user.access_token
    }

    return accessToken
}

const jwtService = {
    signJwt,
    verifyJwt,
    findandreissueToken
}
export default jwtService;
