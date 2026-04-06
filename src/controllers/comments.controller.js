import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query    

    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const comments = await Comment.find({video: videoId})
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    return res.status(200).json(new ApiResponse(true, "Comments fetched successfully", comments))   

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    await Comment.create({
        content,
        owner: req.user._id,
        video: videoId
    })

    return res.status(201).json(new ApiResponse(true, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {        
    const {commentId} = req.params
    const {content} = req.body

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if(comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(new ApiResponse(true, "Comment updated successfully", comment))
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if(comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    await comment.remove();
    return res.status(200).json(new ApiResponse(true, "Comment deleted successfully", comment)) 
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }