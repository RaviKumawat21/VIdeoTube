Here are the complete, structured lecture notes for the **"How to setup a professional backend project"** video by Hitesh Choudhary.

***

# 📝 Lecture Notes: Setting Up a Professional Backend Project

**Lecture:** How to setup a professional backend project
**Instructor:** Hitesh Choudhary
**Context:** This lecture marks the transition from basic "toy" apps to a **Production-Grade** setup. We are initializing the "Mega Project" (YouTube Clone) repository and establishing a folder structure used in top-tier companies.

## 1. The Mega Project: Architecture Overview
Before coding, Hitesh presents the architectural complexity of the project (a YouTube + Twitter clone).

### **Why Data Modeling is Hard**
*   **Scenario:** A single page (like a Video Player) isn't just one data point.
*   **Complexity:**
    *   **User:** Authentication, Avatar, Watch History.
    *   **Video:** URL, Thumbnail, Duration, Views.
    *   **Interaction:** Likes, Comments, Subscriptions.
    *   **Aggregations:** "Show me all videos liked by User X that are also in Playlist Y."
*   **Tools:** The lecture uses **Eraser.io** to visualize these schemas before writing code.
    *   *Note:* You don't need to reinvent the wheel. For this series, we follow a specific, pre-designed schema to ensure consistency.

***

## 2. Initializing the Project

### **Step 1: Basic Setup**
1.  Create a folder `chai-backend`.
2.  `git init` (Initialize Git).
3.  `npm init` (Initialize Node.js).
    *   **Package Name:** `chai-backend`
    *   **Entry Point:** `src/index.js` (We will change this from default `index.js` to organize better).
    *   **License:** MIT/ISC.

### **Step 2: Professional Folder Structure**
We don't dump everything in the root. We use a `src` folder.

**Root Level Files:**
*   `.env` (Environment variables - *Secrets*)
*   `.env.sample` (Public template of env variables for the team)
*   `.gitignore` (What NOT to upload)
*   `.prettierrc` (Code formatting rules)
*   `package.json`
*   `README.md`

**The `src` Directory Structure:**
```text
src/
├── app.js           # Express App Setup
├── index.js         # Entry Point (Server Listen)
├── constants.js     # Enums and fixed values (DB Name, etc.)
├── db/              # Database Connection Logic
├── models/          # Mongoose Schemas (Data Models)
├── controllers/     # Request Handlers (Logic)
├── routes/          # API Routes
├── middlewares/     # Middleware (Auth, Validation)
├── utils/           # Utility functions (Cloudinary, Email, ErrorHandler)
└── public/          # Public assets
    └── temp/        # Temporary storage for file uploads (images/videos)
```

### **Step 3: Handling Empty Folders in Git**
*   **Problem:** Git does *not* track empty folders. If you create `public/temp` but don't put a file in it, it won't go to GitHub.
*   **Solution:** Create a generic empty file named `.gitkeep` inside the folder.
    *   *Path:* `public/temp/.gitkeep`
    *   Now Git will push the folder structure.

***

## 3. Essential Configurations

### **A. Module Type (ES6 Imports)**
Modern backend development uses `import` instead of `require`.
*   **Action:** Open `package.json` and add:
    ```json
    "type": "module"
    ```

### **B. Nodemon (Dev Dependency)**
We don't want to restart the server manually on every save.
*   **Command:** `npm install -D nodemon`
    *   `-D` stands for **Dev Dependency**. We don't need Nodemon in production, only during development.
*   **Script:** Add to `package.json`:
    ```json
    "scripts": {
      "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
    }
    ```

### **C. Prettier (Code Formatting)**
In a team, everyone codes differently (tabs vs spaces, semicolons vs none). Prettier forces a standard style.
*   **Command:** `npm install -D prettier`
*   **Config File:** Create `.prettierrc` in root:
    ```json
    {
      "singleQuote": false,
      "bracketSpacing": true,
      "tabWidth": 2,
      "semi": true,
      "trailingComma": "es5"
    }
    ```
*   **Why:** This ensures that if 5 people work on the project, the code looks like it was written by 1 person.

***

## 4. Git Best Practices

### **The `.gitignore` File**
Use a generator (like `gitignor.io`) or manually add:
```text
node_modules
.env
.DS_Store
dist
coverage
```

### **The `.env` and `.env.sample` Strategy**
*   **`.env`:** Contains real secrets (`MONGO_URI=mongodb+srv://password...`). **Never Push this.**
*   **`.env.sample`:** Contains empty keys (`MONGO_URI=""`). **Push this.**
*   **Reason:** When a new developer joins, they look at `.env.sample` to know which variables they need to configure in their own `.env` file.

***

## 5. Summary of Commands Run
```bash
mkdir chai-backend
cd chai-backend
git init
npm init -y
npm install -D nodemon prettier
mkdir src
cd src
mkdir controllers db middlewares models routes utils
touch app.js index.js constants.js
```

*This setup is the bedrock of the Mega Project. From the next lecture, we start connecting the Database.*

[1](https://www.youtube.com/watch?v=9B4CvtzXRpc)