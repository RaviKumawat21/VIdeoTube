Here are the complete, structured lecture notes for the **"How to deploy backend code in production"** lecture by Hitesh Choudhary (Chai aur Code).

***

# 📝 Lecture Notes: Deploying Backend to Production

**Lecture:** How to deploy backend code in production
**Instructor:** Hitesh Choudhary

## 1. The Goal
The primary fear beginners have is "How does code actually go to a server?". This lecture dispels that fear by building a simple app and deploying it immediately, even before mastering complex backend logic.

**Key Concept:**
*   **Localhost:** Running code on your machine (`localhost:3000`).
*   **Production:** Running code on a remote server (DigitalOcean, AWS, etc.) so anyone can access it.

***

## 2. Setting Up a Basic Node.js Application

### **Step 1: Initialization**
Unlike React (which has `create-react-app`), Node.js apps start from scratch.
1.  Create a folder.
2.  Run `npm init` (or `npm init -y` for defaults).
    *   This creates a `package.json` file.
    *   This file tracks dependencies and scripts.

### **Step 2: Installing Express**
*   **Command:** `npm install express`
*   **Why:** Express is the framework that listens for requests.

### **Step 3: The Basic Server Code (`index.js`)**
This is the "Hello World" of backend.

```javascript
require('dotenv').config() // Load environment variables
const express = require('express')
const app = express()
const port = process.env.PORT || 3000 // Use env variable or default to 3000

// Route 1: Home
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Route 2: Twitter
app.get('/twitter', (req, res) => {
  res.send('hiteshdotcom')
})

// Route 3: Login (Sending HTML)
app.get('/login', (req, res) => {
  res.send('<h1>Please login at chai aur code</h1>')
})

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

### **Step 4: Scripts in `package.json`**
Instead of typing `node index.js` every time, professionals add a script.
```json
"scripts": {
  "start": "node index.js"
}
```
*   **Run with:** `npm run start`

***

## 3. Production Readiness (The Critical Step)
You cannot just upload hardcoded values to a server. What if port 3000 is busy? What if your DB password changes?

### **Environment Variables (`dotenv`)**
*   **Purpose:** Hides sensitive data and allows configuration changes without changing code.
*   **Package:** `npm install dotenv`
*   **File:** Create a `.env` file in the root.
    ```text
    PORT=4000
    ```
*   **Usage:**
    ```javascript
    require('dotenv').config()
    const port = process.env.PORT
    ```

### **Git Ignore (`.gitignore`)**
You **must** prevent certain files from going to GitHub. Create a `.gitignore` file:
```text
node_modules
.env
```
*   **`node_modules`:** Too heavy. We can reinstall them using `package.json`.
*   **`.env`:** Contains secrets. Never share secrets.

***

## 4. Deployment (The "How-To")
*Note: The lecture demonstrates **DigitalOcean App Platform**, but the concepts apply to AWS, Heroku, Railway, Render, etc.*

### **The Workflow**
1.  **Push to GitHub:**
    *   `git init`
    *   `git add .`
    *   `git commit -m "Initial commit"`
    *   `git push origin main`
2.  **Connect Cloud Provider to GitHub:**
    *   Go to DigitalOcean (or Render/Railway).
    *   Select "Create App".
    *   Link your GitHub account.
    *   Select the repository (`chai-backend`).
3.  **Configuration:**
    *   **Environment Variables:** The cloud provider will ask for them. Add `PORT=80` (or whatever they recommend).
    *   **Build Command:** `npm install` (Installs dependencies).
    *   **Start Command:** `npm run start` (Runs your script).
4.  **Deploy:** Click "Save and Deploy".
    *   The cloud provider pulls the code.
    *   It runs `npm install`.
    *   It starts the app.
    *   It gives you a public URL (e.g., `https://sea-lion-app.digitalocean.app`).

***

## 📚 Extra Important Concepts (Not explicitly detailed in video)

### **1. Hot Reloading (Nodemon)**
Hitesh mentioned "stopping and starting" the server manually.
*   **Problem:** Every time you change code, you must restart the server to see changes.
*   **Solution:** Use `nodemon`.
    *   `npm install -D nodemon`
    *   Script: `"dev": "nodemon index.js"`
    *   Now, the server restarts automatically on save.

### **2. Port Conflicts (EADDRINUSE)**
*   **Error:** `Error: listen EADDRINUSE: address already in use :::3000`
*   **Meaning:** Another program is already using port 3000.
*   **Fix:** Change the port in your `.env` file or kill the other process.

### **3. CommonJS vs ES Modules**
*   **CommonJS (Old/Standard Node):** `const express = require('express')`
*   **ES Modules (Modern/React style):** `import express from 'express'`
*   To use `import` in Node.js, add `"type": "module"` to your `package.json`. Hitesh used CommonJS (`require`) in this video for simplicity, but modern backend development often uses ES Modules.

[1](https://www.youtube.com/watch?v=pOV4EjUtl70)