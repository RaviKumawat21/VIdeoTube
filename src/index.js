//we want that when our first file is going to load then our all the environment varible is going to load
// require('dotenv').config;
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js"; 
import connectionDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: './env'
});

//because whenever asynchronous operation is going to return then ir return in the form of promise
connectionDB()
.then(() => {
    //Start the webserver and keep listening the http request on the PORT(which comes from the environment varible)
    app.listen((process.env.PORT || 8000), () => {
        console.log(`Server is running at PORT: ${process.env.PORT}`);
        

    })
})
.catch((error)=>{
    console.log(`MONGO_DB connection ERR!!! :` + error);
    
}
)

/*
import express from 'express';
const app = express();

;(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

       //there is a chance that app is throwing error so there is listerners in express 
       app.on("error", (error)=>{
        console.log("ERRR: ", error);
        throw error;
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`); //process.env.PORT means on the running process we are taking PORT varible from the environment varibles
        
       })

    } catch (error) {
        console.error("ERROR ", error)
        throw error;
    }
})();
*/