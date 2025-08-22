import mongoose from "mongoose";
import { Schema } from "mongoose";
import Video from "./video.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
        
    },
    fullName: {
        type: String,
        required: true,
        index: true,
        trim: true
        
        
    },
    password: {
        type: String,
        required: [true, "Password is required"]
        
        
    },
    avatar: {
        type: String,   //comes from cloudinary url
        required: true
    },
    coverImage: {
        type: String  //comes from cloudinary url
        
    },
    //watch history is an array of objects which contains video objectId
    watchHistory: [

        {
            type: Schema.Types.ObjectId,
            ref: "Video" //reference to video model
        }
    ],
    refreshToken: {
        type: String
    }

},{timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken  = function(){
    jwt.sign({
        _id : this._id,
        username : this.username,
        email : this.email,
        fullName : this.fullName,
        
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })};

    userSchema.methods.generateRefreshToken  = function(){
        jwt.sign({
            _id : this._id,
            // username : this.username,
            // email : this.email,
            // fullName : this.fullName,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        });

}
const User = mongoose.model("User", userSchema);

export default User;