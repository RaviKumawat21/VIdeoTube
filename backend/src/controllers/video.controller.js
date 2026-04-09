import mongoose, {isValidObjectId} from "mongoose"
import Video from "../models/video.model.js"
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandlers.js"
import uploadOnCloudinary from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    // 1. Ensure page and limit are numbers
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // 2. Initialize an empty match criteria object
    const matchCriteria = {};

    // 3. IF we receive a 'query', search 'title' or 'description'
    if (query) {
        matchCriteria.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    // 4. IF we receive a 'userId', filter videos by the owner
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID format");
        }

        matchCriteria.owner = new mongoose.Types.ObjectId(userId);
    }

    // 5. Always ensure we only fetch published videos
    matchCriteria.isPublished = true;

    // 6. Build the pipeline array
       // 6. Build the pipeline array with $lookup to get owner details
    const pipeline = [
        {
            $match: matchCriteria
        },
        {
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
                ownerDetails: {
                    $first: "$ownerDetails"
                }
            }
        }
    ];

    // 7. Determine sorting
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({
            $sort: { createdAt: -1 }
        });
    }

    // 8. Pagination options
    const options = {
        page,
        limit,
        customLabels: {
            docs: "videos",
            totalDocs: "totalVideos"
        }
    };

    // 9. Execute query
    const aggregateQuery = Video.aggregate(pipeline);
    const result = await Video.aggregatePaginate(aggregateQuery, options);

    // 10. Send response
    return res.status(200).json(
        new ApiResponse(200, result, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // Get the local paths from multer fields
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) throw new ApiError(400, "Video file is required");
    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail file is required");

    // Upload to Cloudinary
    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload) throw new ApiError(500, "Error uploading video to Cloudinary");
    if (!thumbnailUpload) throw new ApiError(500, "Error uploading thumbnail to Cloudinary");

    // Create the DB record
    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        // Cloudinary automatically returns duration for videos
        duration: videoUpload.duration || 0,
        isPublished: true, 
        owner: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    // Use .populate so we can show the channel name/avatar on the frontend
    const video = await Video.findById(videoId).populate("owner", "fullName username avatar");

    if (!video) throw new ApiError(404, "Video not found");

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    // Check ownership
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to modify this video");
    }

    let thumbnailUrl = video.thumbnail;
    
    // If user provided a new thumbnail via multer upload
    if (req.file?.path) {
        const thumbnailUpload = await uploadOnCloudinary(req.file.path);
        if (thumbnailUpload) {
            thumbnailUrl = thumbnailUpload.url;
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                thumbnail: thumbnailUrl
            }
        },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this video");
    }

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to change the publish status");
    }

    // Toggle the boolean value
    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}