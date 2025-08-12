// Main task of the controllers is that it is defining the functioning when the routes hits to that controller(means auctual logic that how this is happens is actually written in the controllers)
import asyncHandler from "../utils/asyncHandlers.js"

//asyncHandler autometicaly put the try catch and async-await on the function which is passed inside this function as an argument
const registerUser = asyncHandler((req,res) => {
    res.status(200).json({
        message : "ok"
    })
}
)

export default registerUser;