import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandlers.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if(existingLike) {
        // unlike
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(true, "Video unliked successfully"))
    } else {
        // like
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        return res.status(200).json(new ApiResponse(true, "Video liked successfully"))
    }   
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if(existingLike) {
        // unlike
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(true, "Comment unliked successfully"))
    } else {
        // like
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        return res.status(200).json(new ApiResponse(true, "Comment liked successfully"))
    }   
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if(existingLike) {
        // unlike
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(true, "Tweet unliked successfully"))
    } else {
        // like
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        return res.status(200).json(new ApiResponse(true, "Tweet liked successfully"))
    }
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const likedVideos = await Like.aggregate([
        {
            // Set 1: Find all likes by this specific user where the "video" field exists
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true, $ne: null }
            }
        },
        {
            // Step 2: Join with the videos collection to get video details
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        // Step 3: Inside the video, join with the users collection to get the video owner's details
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            ownerDetails: { $first: "$ownerDetails" }
                        }
                    }
                ]
            }
        },
        {
            // Step 4: Convert the video array from $lookup into an object
            $unwind: "$video"
        },
        {
            // Step 5: Sort by newest likes first
            $sort: {
                createdAt: -1
            }
        },
        {
            // Step 6: Select only the fields we want to send to the frontend
            $project: {
                _id: 0, // Hide the Like document ID completely
                likedVideo: "$video" // Return the video object as the main result
            }
        }
    ]);

    // Format the response nicely: map over result to just return an array of videos
    const extractedVideos = likedVideos.map((item) => item.likedVideo);

    return res.status(200).json(
        new ApiResponse(200, extractedVideos, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}