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
    const pipeline = [
        {
            $match: matchCriteria
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
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}