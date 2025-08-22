// Main task of the controllers is that it is defining the functioning when the routes hits to that controller(means auctual logic that how this is happens is actually written in the controllers)
import asyncHandler from "../utils/asyncHandlers.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"


//asyncHandler autometicaly put the try catch and async-await on the function which is passed inside this function as an argument
const registerUser = asyncHandler(async(req,res) => {
    //Get user details from the fronted
    const {username, email, password, fullName} = req.body;
    // console.log();

    //Validation not empty
    if([username, email, password, fullName].some((feilds) =>
    feilds?.trim() === "") )
    {

        throw new ApiError(400, "All fields are required");
    }

    //cheack if email is valid or not
    const existedUser = await User.findOne(
        {$or: [
            {email: email},
            {username: username}
        ]}
    )
    if(existedUser)
    {
        throw new ApiError(409, "User already existed");
    }


    //cheack for avatar and images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
       
    //upload them to cloudinary
    if(!avatarLocalPath )
    {
        throw new ApiError(400, "All fields are required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //create user object in db

    const user =await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    //Remove password and refresh token from the response

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while registering the user please try again");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User has been registered successfully" )
    )
}
)

export default registerUser;