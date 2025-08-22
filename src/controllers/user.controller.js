// Main task of the controllers is that it is defining the functioning when the routes hits to that controller(means auctual logic that how this is happens is actually written in the controllers)
import asyncHandler from "../utils/asyncHandlers.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"

const generateRefreshAndAccessToken = async(user_id) => {
    try {
        const user = await findById(user_id);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken // adding the refresh token in the user schema
        user.save({validateBeforeSave : false})

        return {accessToken, refreshToken};
        
    } catch (error) {
        throw new ApiError(500, "Unable to generate refresh and access token")
    }
}

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

// controller for the user login
const loginUser = asyncHandler(async(req, res) =>{
//Algorithm
    // get data form the req body
    // see username or email and password is given by the user or not 
    // if there missing username or email or password then send a apiError to user that email or userName  or password missing
    
    // then cheak in the mongodb database is this exits or not if exists then cheak password is correct or not
    //if user authenticate successfully then generate refresh and accessTokens and save refreshToken in the database
    //after gernerating access and refresh token send them into cookies
    //return responses with the status code tokens and the successfull message  



    const {email, username, password} = req.body();

    if( !email && !username){
        throw new ApiError(400, "Email or username is required for the login")
    }

    const user = await User.findOne(
        {
            $or: [{email}, {username}]
        }
        
    )


    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Password wrong")
    }

    const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const option = {
        httpOnly : true,
        secure : true 
    }

    return res.status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
        new ApiResponse(
            200,
            {
               user: loggedInUser, refreshToken,
                accessToken
            },
            "User Loggedin successfully"
        )
    )



})


// Controller for the loggedOut
const logoutUser = asyncHandler(async(req, res) => {
  /*  //Algo:
            1.Remove refreshToken from the db
            2.Remove the cookies
        //problem:
            For removing refresh token from the db we need user access which is currently loggedIn which we doesNot have.(for this I am creating the auth middleware which i am injecting in the logout router. This auth middleware give me access of the current logged in user)     
  */
 await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export { registerUser,
          loginUser,
          logoutUser
        };
