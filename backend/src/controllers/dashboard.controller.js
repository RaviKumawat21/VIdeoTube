import mongoose from "mongoose"
import Video from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandlers.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Get Total Videos and Total Views
    const videoStats = await Video.aggregate([
        { 
            $match: { owner: new mongoose.Types.ObjectId(userId) } 
        },
        { 
            $group: { 
                _id: null, 
                totalVideos: { $sum: 1 }, 
                totalViews: { $sum: "$views" } 
            } 
        }
    ]);

    const totalVideos = videoStats.length > 0 ? videoStats[0].totalVideos : 0;
    const totalViews = videoStats.length > 0 ? videoStats[0].totalViews : 0;

    // 2. Get Total Subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    // 3. Get Total Likes across all videos by this user
    // First, get all video IDs owned by the user
    const userVideos = await Video.find({ owner: userId }, "_id");
    const videoIds = userVideos.map(video => video._id);

    // Then, count all likes associated with those videos
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    // Construct the final stats object
    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch all videos for the logged-in user (including unpublished ones for the dashboard)
    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 }) // Newest first
        .select("-__v"); // Exclude mongoose version key

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
});

export {
    getChannelStats, 
    getChannelVideos
}