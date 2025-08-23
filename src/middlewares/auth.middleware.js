import asyncHandler from "../utils/asyncHandlers.js"
import jwt from "jsonwebtoken"

import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"

 export const varifyJWT = asyncHandler(async(req, res, next) => {
    /*
        Algo:
            1.I got the access of the user from the access and refreshtoken
            2.Access token has the access for the user_id fatch that and add it to request.

             */

            try {
                const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "")
                // console.log("Token Received",token);
    
                if(!token){
                    throw new ApiError(404,"no token provided");
                }
                 const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
            if (!user) {
                
                throw new ApiError(401, "Invalid Access Token")
            }
        
            req.user = user;
            next()
            } catch (error) {
                throw new ApiError(401, "unauthorized user"+ error?.message)
            }

}
)