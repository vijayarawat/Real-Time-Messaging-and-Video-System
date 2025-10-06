import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";



export const isAuthenticated = asyncHandler( async (req,res,next)=>{
    
    const token = req.cookies.token || req.headers['authorization'].replace("Bearer ","");
    console.log("token",token)
    if(!token)
        return next(new errorHandler("Invalid token",400))
    const tokenData= jwt.verify(token, process.env.JWT_SECRET)
    console.log("Token Data::::", tokenData)
    req.user = tokenData
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers.authorization);

    next()
})