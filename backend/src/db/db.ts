import mongoose from "mongoose";
import { logger } from "../handlers/handler";

export const connectToMongoDb = async(MongoURI:string)=>{
try{await mongoose.connect(MongoURI)
    logger("INFO","MongoDb connected successfully")
}catch(error){
    logger("ERROR","DbConnectionError: ",error);  
}
}