import { Request,Response, NextFunction } from "express"

type handlerFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => any | Promise<any>| Promise<void>;

export const asyncHandler =  (fn:handlerFn, finallyBlock?:any) => {

    // It returns a whole controller function 
    return  async (req:Request,res:Response,next:NextFunction) => {
                try{
                    return await Promise.resolve(fn(req,res,next));
                }catch(error){
                    next(error)
                }finally{
                    if(finallyBlock && typeof finallyBlock === "function"){
                        try{
                            await Promise.resolve(finallyBlock(req,res,next));
                        }catch(error:any){
                            console.error({"FinallyBlockError":error.message});
                                
                        }
                    }
                }
    }
}


export const sendResponse = (
  res: Response,
  statusCode: number,
  detail?: string,
  data?: Record<string, any>
) => {

    if (detail){
        return res.status(statusCode).json({
              success: statusCode < 400,
              detail,
              ...(data && { data }),
            });
    }
    return res.status(statusCode).json({
              success: statusCode < 400,
              ...(data && { data }),
            });
};

interface RedirectOptions {
  statusCode?: number; // default 302
  queryParams?: Record<string, string | number>; // optional query params
}

/**
 * Redirect Response Handler
 */
export const sendRedirect = (
  res: Response,
  url: string,
  options?: RedirectOptions
) => {
  const statusCode = options?.statusCode || 302;

  // Append query params if provided
  let redirectUrl = url;

  // Check if options or queryparams exists or not  
  if (options?.queryParams) {
    const params = new URLSearchParams(
      options.queryParams as Record<string, string>
    ).toString();

    redirectUrl += url.includes("?") ? `&${params}` : `?${params}`;
  }
  return res.redirect(statusCode, redirectUrl);
};

export const logger = ( messageInfo:"INFO"|"ERROR",detail:string, message?:unknown ) => {
    console.log(`${messageInfo}: ${detail}`);
    if (message){
      console.log(message);
    } 
    
     
}


