import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({
    limit : "16kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));

//import the routers

import userRouter from "./routes/user.routes.js"

//routes decleration 
// we use app.use because router ko lane ke liye middleware lana parega
app.use("/api/v1/users", userRouter );

// http://localhost:8000/api/v1/users   (/register will also put at the last when the userRouter route hits because there is define a router for the register here just we define a middleware before calling the router after calling the router router post the request for the register user to his respective controller )

export default app;

