import { Model } from "mongoose";
import { logger } from "../handlers/handler";
import User from "../models/stripeModels/subscription.model";

// 1. Removed 'extends Document' to stop the property mismatch error
// 2. Used 'keyof T' to ensure the field exists on the model
export const findInstance = async <T>(
  model: Model<T>, 
  field: keyof T | string, 
  value: any
) => {
  
  return await model.find({ [field]: value }).exec();
};

const email = "vikalp.pandey2004@gmail.com";

const commonService = {
    findInstance,
}

export default commonService;