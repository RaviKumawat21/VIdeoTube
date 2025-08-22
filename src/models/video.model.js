import mongoose from "mongoose";
import {Schema} from "mongoose";
import User from "./user.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudnary url
        required: true

    },
    thumbnail: {
        type: String,  //cloudnary url
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description :{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    views:{
        type: Number,
        default: 0,
        required: true  
    },
    isPublished: {
        type: Boolean,
        required: true
    }  



},{timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model("Video", videoSchema);
export default Video;