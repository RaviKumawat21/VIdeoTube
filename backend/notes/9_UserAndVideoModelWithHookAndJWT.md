Here are the complete, structured lecture notes for the **"User and video model with hooks and JWT"** video by Hitesh Choudhary.

***

# 📝 Lecture Notes: User & Video Models with JWT & Hooks

**Lecture:** User and video model with hooks and JWT
**Instructor:** Hitesh Choudhary
**Context:** We are designing the core data models for the "Mega Project" (YouTube Clone). This involves creating complex schemas, handling password encryption, and setting up authentication tokens (JWT).

***

## 1. Project Structure Update
We are working inside the `src/models` folder.
*   Created: `user.model.js`
*   Created: `video.model.js`

*Note: The naming convention `name.model.js` is a standard practice in backend development to easily identify files.*

***

## 2. The User Model (`user.model.js`)
The User model is the backbone of the application. It handles authentication, profile details, and watch history.

### **Key Fields & Logic**
1.  **`username` / `email` / `fullName`**: Standard string fields.
    *   *Properties:* `required: true`, `unique: true`, `lowercase: true`, `trim: true`.
    *   **`index: true`**: Added to `username` (and optionally `email` or `fullName`) to make searching optimized in MongoDB. Indexing makes retrieval faster but can slightly slow down writes.
2.  **`avatar` / `coverImage`**: Strings.
    *   We do not store images directly in the database (Base64 is bad for performance).
    *   We upload to a third-party service (Cloudinary) and store the **URL** string here.
3.  **`watchHistory`**: An Array.
    *   It stores an array of Video IDs.
    *   Type: `[Schema.Types.ObjectId]`, Ref: `"Video"`.
4.  **`password`**: String.
    *   **Challenge:** Never store passwords in plain text (e.g., "12345").
    *   **Solution:** Encrypt (Hash) the password before saving.
5.  **`refreshToken`**: String.
    *   Used for maintaining sessions without forcing the user to log in repeatedly.

### **User Schema Code Snippet**
```javascript
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true // Optimized for searching
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // Cloudinary URL
            required: true,
        },
        coverImage: {
            type: String, // Cloudinary URL
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
```

***

## 3. The Video Model (`video.model.js`)
The Video model stores metadata about uploaded content.

### **Key Fields & Logic**
1.  **`videoFile`**: String (Cloudinary URL).
2.  **`thumbnail`**: String (Cloudinary URL).
3.  **`duration`**: Number.
    *   Cloudinary provides the duration of the video upon upload. We store this efficiently as a number (seconds).
4.  **`views`**: Number (Default: 0).
5.  **`isPublished`**: Boolean (Default: true).
6.  **`owner`**: ObjectId.
    *   Links the video to the User who uploaded it.
    *   Ref: `"User"`.

### **Mongoose Aggregate Paginate**
*   **Concept:** MongoDB standard queries are fine, but for a YouTube clone, we need complex aggregation (e.g., filtering, sorting, complex joins).
*   **Plugin:** We install `mongoose-aggregate-paginate-v2` to allow pagination on aggregation queries easily.

### **Video Schema Code Snippet**
```javascript
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // Cloudinary URL
            required: true
        },
        thumbnail: {
            type: String, // Cloudinary URL
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, 
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)
```

***

## 4. Password Encryption (Bcrypt) & Hooks
We installed `bcrypt` (or `bcryptjs`).
*   **Bcrypt:** A library to hash passwords.

### **The `pre` Hook (Middleware)**
We use Mongoose's `pre("save")` hook to run code *just before* the data is saved to MongoDB.

*   **Critical Check:** We must check `if (this.isModified("password"))`.
    *   *Why?* If a user changes their avatar but *not* their password, we don't want to re-hash the already hashed password.

```javascript
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
```
*   **Note:** Do not use Arrow Functions `() => {}` here. We need `this` context to access the schema fields.

### **Custom Methods**
We can add custom methods to our schema to perform specific tasks.
*   **`isPasswordCorrect`**: Compares a plain text string (from login form) with the encrypted hash in the DB.

```javascript
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
```

***

## 5. JWT (JSON Web Tokens)
*   **Concept:** JWT is a **Bearer Token**. Whoever holds the token acts as the user. It's like a physical key.
*   **Structure:** Header + Payload (Data) + Signature (Secret).
*   **Library:** `jsonwebtoken` (npm install jsonwebtoken).

### **Access Token vs Refresh Token**
1.  **Access Token:** Short lifespan (e.g., 15 mins). Used to authenticate requests.
2.  **Refresh Token:** Long lifespan (e.g., 10 days). Stored in the database. Used to get a new Access Token when the old one expires.

### **Implementation in User Model**
We create methods to generate these tokens directly on the user schema.

```javascript
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
```

***

## 6. Environment Variables
You need to add these secrets to your `.env` file. The secrets can be random complex strings.

```env
ACCESS_TOKEN_SECRET=chai-aur-code-access-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=chai-aur-code-refresh-secret
REFRESH_TOKEN_EXPIRY=10d
```

## 📝 Summary Checklist
1.  [x] Created `User` schema with Indexing.
2.  [x] Created `Video` schema with Aggregate Paginate.
3.  [x] Implemented `pre("save")` hook to hash passwords.
4.  [x] Created `isPasswordCorrect` method using bcrypt.
5.  [x] Created `generateAccessToken` method.
6.  [x] Created `generateRefreshToken` method.

[1](https://www.youtube.com/watch?v=eWnZVUXMq8k)