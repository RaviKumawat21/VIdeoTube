import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name || name.trim() === "") {
        throw new ApiError(400, "Name is required")
    }

    if(!description || description.trim() === "") {
        throw new ApiError(400, "Description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id // assuming that user id is injected by auth middleware
    })
    
    if(!playlist) {
        throw new ApiError(500, "Failed to create playlist")
    }

    return res.status(201).json(new ApiResponse(true, "Playlist created successfully", playlist))
    

   

    


    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params.userId;
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    if(userId !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this user's playlists")
    }
    const playlists = await Playlist.find({owner: userId}).sort({createdAt: -1});

    return res.status(200).json(new ApiResponse(true, "User playlists fetched successfully", playlists))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params.playlistId;
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos");
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this playlist")
    }

    return res.status(200).json(new ApiResponse(true, "Playlist fetched successfully", playlist))   
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    if(playlistId !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // if(playlist.videos.includes(videoId)) {
    //     throw new ApiError(400, "Video already exists in the playlist")
    // }

    // playlist.videos.push(videoId);
    // await playlist.save();

    await Playlist.findByIdAndUpdate(playlistId, {
        $addToSet: { videos: videoId }
    });

    return res.status(200).json(new ApiResponse(true, "Video added to playlist successfully", playlist))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if(playlistId !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // if(!playlist.videos.includes(videoId)) {
    //     throw new ApiError(400, "Video does not exist in the playlist")
    // }

    // playlist.videos.pull(videoId);
    // await playlist.save();

    await Playlist.findByIdAndUpdate(playlistId, {
        $pull: { videos: videoId }
    });
    
    return res.status(200).json(new ApiResponse(true, "Video removed from playlist successfully", playlist))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist")
    }

    await playlist.remove();
    return res.status(200).json(new ApiResponse(true, "Playlist deleted successfully", playlist))   
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    if(name && name.trim() !== "") {
        playlist.name = name;
    }

    if(description && description.trim() !== "") {
        playlist.description = description;
    }

    await playlist.save();
    return res.status(200).json(new ApiResponse(true, "Playlist updated successfully", playlist))       
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}