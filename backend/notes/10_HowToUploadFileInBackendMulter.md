Here are the complete, structured lecture notes for the **"How to upload file in backend | Multer"** video by Hitesh Choudhary.

***

# 📝 Lecture Notes: File Uploads (Multer & Cloudinary)

**Lecture:** How to upload file in backend | Multer
**Instructor:** Hitesh Choudhary
**Context:** We are setting up a robust file upload system. The frontend cannot magically send files to the database. We need a mechanism in the backend to receive files, store them temporarily, upload them to a cloud provider (Cloudinary), and then clean up the server.

***

## 1. The Strategy
Handling files on your own production server permanently is bad practice (it fills up disk space and is hard to manage).

**The Professional Flow:**
1.  **Client** (Frontend) sends a file via a form.
2.  **Server** (Our Backend) receives the file using **Multer**.
3.  **Multer** saves the file *temporarily* to the local server (e.g., `public/temp`).
4.  **Cloudinary Utility** takes the local file path, uploads it to **Cloudinary**.
5.  **Cleanup:** Once uploaded, we delete (unlink) the file from our local server to keep it clean.

***

## 2. Cloudinary Setup (The Cloud Storage)
Cloudinary is a service to store and manage media (images/videos).

### **Setup:**
1.  Create a free account on [Cloudinary](https://cloudinary.com/).
2.  Get your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
3.  Add these credentials to your `.env` file:
    ```env
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  Install the SDK:
    ```bash
    npm install cloudinary
    ```

### **The Utility Function (`src/utils/cloudinary.js`)**
This file handles the logic of uploading to Cloudinary and deleting the local file.

```javascript
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Node.js File System module

// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Detects image/video/pdf automatically
        })

        // File has been uploaded successfully
        console.log("File is uploaded on cloudinary ", response.url);
        
        // Remove the locally saved temporary file
        fs.unlinkSync(localFilePath) 
        
        return response;

    } catch (error) {
        // If upload fails, remove the local file so we don't hoard garbage
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

export { uploadOnCloudinary }
```

***

## 3. Multer Setup (The Middleware)
Multer is a node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files. Express cannot handle file uploads out of the box.

### **Installation:**
```bash
npm install multer
```

### **The Middleware (`src/middlewares/multer.middleware.js`)**
We configure Multer to use **Disk Storage** (saving to our hard drive) rather than Memory Storage (RAM), which can crash the server with large files.

```javascript
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // We store files in the 'public/temp' folder we created earlier
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      // We keep the original name for simplicity. 
      // In production, you might want to append a unique suffix (Date.now() + random)
      cb(null, file.originalname)
    }
})
  
export const upload = multer({ 
    storage: storage, 
})
```

***

## 4. How to Use It (Preview)
Although we haven't written the Controller yet, here is how we will inject this middleware into our Routes.

**In `user.routes.js` (Future Code):**
```javascript
import { upload } from "../middlewares/multer.middleware.js"
import { registerUser } from "../controllers/user.controller.js"

// Inject middleware before the controller
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
```
*   **`upload.fields`**: Allows uploading multiple files with different field names (avatar, coverImage).
*   **`registerUser`**: The controller will then receive `req.files`, get the path, and call `uploadOnCloudinary(path)`.

***

## 5. Important Concepts
*   **`fs` (File System):** A built-in Node.js module. We use `fs.unlinkSync()` to delete files. "Unlink" is the operating system term for deleting a file (removing the link to the data on the disk).
*   **Middleware Injection:** We use Multer as a middleware because not every route needs file upload capabilities. We only inject it into routes that specifically handle files (like Registration or Video Upload).

## 📝 Summary Checklist
1.  [x] Created Cloudinary Account & got API Keys.
2.  [x] Installed `cloudinary` and `multer`.
3.  [x] Configured Environment Variables.
4.  [x] Created `src/utils/cloudinary.js` (Upload + Delete Logic).
5.  [x] Created `src/middlewares/multer.middleware.js` (Disk Storage Config).
6.  [x] Understood the flow: Client -> Multer (Local) -> Cloudinary (Cloud) -> Delete Local.

[1](https://www.youtube.com/watch?v=6KPXn2Ha0cM)