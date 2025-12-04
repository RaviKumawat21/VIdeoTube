Here are the complete, structured lecture notes for the **"Custom API response and error handling"** video by Hitesh Choudhary.

***

# 📝 Lecture Notes: API Response & Error Handling

**Lecture:** Custom api response and error handling
**Instructor:** Hitesh Choudhary
**Context:** We are moving from basic setup to **Production-Grade** configuration. This involves setting up middleware, handling CORS, parsing different data formats (JSON, URL encoded), and standardizing how our API sends responses and handles errors.

***

## 1. Configuring `app.js`
We created `app.js` earlier but left it empty. Now we configure Express and Middleware.

### **Step 1: Basic Express Setup**
In `src/app.js`:
```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Exporting app to be used in index.js
export { app };
```

### **Step 2: Middleware Configuration**
We use `app.use()` to configure middleware. Middleware are functions that execute during the request-response cycle.

#### **A. CORS (Cross-Origin Resource Sharing)**
We need to allow our frontend to talk to our backend.
*   **Origin:** Defines who can talk to the server. We use `process.env.CORS_ORIGIN`.
*   **Credentials:** Allows cookies to be sent/received.

```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true
}))
```
*   *Note:* Update your `.env` file: `CORS_ORIGIN=*` (for dev) or specific URL.

#### **B. Data Parsing (JSON & URL)**
The server needs to understand different data formats coming from the client.

1.  **JSON:** To handle data coming from forms/JSON body.
    ```javascript
    app.use(express.json({ limit: "16kb" }))
    ```
    *   *Limit:* Prevents server crashes by rejecting massive payloads.

2.  **URL Encoded:** To handle data from URLs (e.g., `hitesh+choudhary` or `hitesh%20choudhary`).
    ```javascript
    app.use(express.urlencoded({ extended: true, limit: "16kb" }))
    ```
    *   *Extended:* Allows nested objects in the URL.

#### **C. Static Assets**
To store files like images, favicons locally on the server (in the `public` folder).
```javascript
app.use(express.static("public"))
```

#### **D. Cookie Parser**
Allows the server to access and set cookies in the user's browser securely.
```javascript
app.use(cookieParser())
```

***

## 2. The `asyncHandler` Utility
**The Problem:** Interacting with a database is *asynchronous* and *can fail*.
*   Writing `try-catch` blocks in every single controller (User, Video, Tweet, etc.) creates massive code duplication.

**The Solution:** Create a wrapper function that handles the async logic and errors centrally.

### **Implementation (Promise Method - Recommended)**
Create `src/utils/asyncHandler.js`:

```javascript
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export { asyncHandler }
```
*   **Logic:** It takes a function (`requestHandler`), executes it, and if it fails, it catches the error and passes it to the `next` middleware (which will be our error handler).

### **Alternative Implementation (Try-Catch Method)**
*For reference only, we will use the Promise method above.*
```javascript
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
```

***

## 3. Custom API Error Handling
**The Problem:** Node.js provides a default `Error` class, but it lacks specific fields we need for an API (like HTTP status codes, standardized error messages, specific data).

**The Solution:** Extend the built-in `Error` class.

Create `src/utils/ApiError.js`:
```javascript
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }
```
*   **Why override?** Now, whenever we throw an error, we enforce sending a `statusCode` and a standard structure.

***

## 4. Custom API Response Handling
**The Problem:** Without a standard, one developer might send `res.send("Success")`, another `res.json({data: ...})`, making the frontend parsing difficult.

**The Solution:** Create a standard class for success responses.

Create `src/utils/ApiResponse.js`:
```javascript
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }
```
*   **Logic:** Server status codes below 400 represent success. This class ensures every response has a `statusCode`, `data`, and `message`.

***

## 5. Connecting `app.js` to `index.js`
Now that `app.js` is configured, we import it into our entry point.

**In `src/index.js`:**
```javascript
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from './app.js' // Import the configured app

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    // Start Server only after DB connection
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
```

***

## 📝 Summary of File Structures Created
1.  **`src/app.js`**: Middleware config (CORS, JSON, CookieParser).
2.  **`src/utils/asyncHandler.js`**: Wrapper to avoid repetitive try-catch blocks.
3.  **`src/utils/ApiError.js`**: Standardized error object.
4.  **`src/utils/ApiResponse.js`**: Standardized success response object.
5.  **`src/index.js`**: Connects DB -> Then starts App.

*Next Step: We will start writing Models (User/Video) and Controllers using these utilities.*

[1](https://www.youtube.com/watch?v=S5EpsMjel-M)
