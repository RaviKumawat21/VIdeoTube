import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandlers.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id // asuming that is      injected by auth middleware
    })

    if(!tweet) {
        throw new ApiError(500, "Failed to create tweet")
    }

    return res.status(201).json(new ApiResponse(true, "Tweet created successfully", tweet))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId;
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    
    const user = await User.findById(userId);
    if(!user) {
        throw new ApiError(404, "User not found")
    }

    const tweets = await Tweet.find({owner: userId}).sort({createdAt: -1});

    return res.status(200).json(new ApiResponse(true, "User tweets fetched successfully", tweets))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body;
    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    const tweetId = req.params.tweetId;
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    // Check if the logged in user is the owner of the tweet
    if(tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new ApiResponse(true, "Tweet updated successfully", tweet))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId = req.params.tweetId;
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    } 
         
    // Check if the logged in user is the owner of the tweet
    if(tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    await tweet.remove();
    return res.status(200).json(new ApiResponse(true, "Tweet deleted successfully", tweet))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}