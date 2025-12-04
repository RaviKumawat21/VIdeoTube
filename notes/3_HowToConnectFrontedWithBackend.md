Here are the complete, structured lecture notes for the **"How to connect frontend and backend in javascript | Fullstack Proxy and CORS"** lecture by Hitesh Choudhary.

***

# 📝 Lecture Notes: Connecting Frontend & Backend (CORS & Proxy)

**Lecture:** How to connect frontend and backend in javascript
**Instructor:** Hitesh Choudhary

## 1. The Big Picture: Production Mindset
*   **The Fear:** Many developers fear "Production."
*   **Reality:** Production is just deploying what you built. It is not a different beast.
*   **The Scenario:** We are building a full-stack app.
    *   **Backend:** Node/Express (Serving API data).
    *   **Frontend:** React (Consuming API data).
*   **The Challenge:** How do these two "talk" to each other when they run on different ports (origins)?

***

## 2. Project Setup
To simulate a real environment, we create a root folder containing both applications.

**Directory Structure:**
```text
FullStackBasic/
├── backend/     (Node + Express)
└── frontend/    (Vite + React)
```

### **A. Setting up the Backend**
1.  Create folder `backend`.
2.  Run `npm init -y`.
3.  Run `npm install express`.
4.  Create `server.js`.

**Key Configuration (ES Modules):**
By default, Node.js uses CommonJS (`require`). To use modern ES6 Modules (`import`), add this to `backend/package.json`:
```json
"type": "module"
```

**The Backend Code (`server.js`):**
We create a simple server that serves a list of jokes. Notice the standardized URL structure (`/api/jokes`).

```javascript
import express from 'express';

const app = express();

// Production Best Practice: Standardize API routes
// Instead of just '/jokes', use '/api/jokes' or '/api/v1/jokes'
app.get('/api/jokes', (req, res) => {
  const jokes = [
    {
      id: 1,
      title: 'A joke',
      content: 'This is a joke'
    },
    {
      id: 2,
      title: 'Another joke',
      content: 'This is another joke'
    },
    {
      id: 3,
      title: 'A third joke',
      content: 'This is a third joke'
    },
    {
      id: 4,
      title: 'A fourth joke',
      content: 'This is a fourth joke'
    },
    {
      id: 5,
      title: 'A fifth joke',
      content: 'This is a fifth joke'
    }
  ];
  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
```

### **B. Setting up the Frontend**
1.  Go to root folder.
2.  Run `npm create vite@latest` (Name it `frontend`).
3.  Run `npm install`.
4.  Run `npm install axios` (A better alternative to `fetch` for handling requests).

**The Frontend Logic (`App.jsx`):**
We want to fetch the jokes when the app loads.

```javascript
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    // PROBLEM: We are calling localhost:3000 from localhost:5173
    axios.get('/api/jokes') 
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <>
      <h1>Chai and Full Stack</h1>
      <p>Jokes: {jokes.length}</p>

      {
        jokes.map((joke) => (
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
```

***

## 3. The Problem: CORS
If you run the code above (Backend on port 3000, Frontend on port 5173), the browser will throw a **CORS Error**.

### **What is CORS?**
*   **Definition:** Cross-Origin Resource Sharing.
*   **The Concept:** It is a security mechanism implemented by **Browsers** (not the backend server itself).
*   **Analogy:**
    *   Your house (Server) allows your family (Same Origin) to enter freely.
    *   If a stranger (Different Origin) tries to enter, you check if they are allowed.
*   **What constitutes a "Cross Origin"?**
    *   Different Domain (google.com vs facebook.com)
    *   Different Port (localhost:**3000** vs localhost:**5173**)

The browser sees you are on port 5173 asking for data from 3000, and blocks it for safety.

***

## 4. The Solution: Proxy
While you can install the `cors` package in the backend to whitelist the frontend, a more professional approach for local development (and connecting front/back) is using a **Proxy**.

### **How Proxy Works**
1.  The Frontend (React) asks its *own* server (Vite) for `/api/jokes`.
2.  The Browser sees `localhost:5173` asking `localhost:5173`. **No CORS error.**
3.  Vite (the Proxy) takes that request and secretly forwards it to `localhost:3000`.
4.  Servers talking to Servers do **not** have CORS issues.

### **Implementation (`vite.config.js`)**
We modify the Vite configuration to enable this forwarding.

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // whenever the path starts with '/api', redirect to target
      '/api': 'http://localhost:3000',
    },
  },
  plugins: [react()],
})
```

**Correction in `App.jsx`:**
Because of the proxy, we remove the domain from the fetch call.
*   **Old:** `axios.get('http://localhost:3000/api/jokes')`
*   **New:** `axios.get('/api/jokes')`

The browser thinks it's fetching from itself, but Vite tunnels it to the backend.

***

## 📚 Extra Important Concepts (Critical for Production)

The video covers the "Proxy" method, which is standard for **Development**. However, in **Production**, things work differently.

### **1. Does `vite.config.js` proxy work in Production?**
**NO.**
The `vite.config.js` proxy settings are part of the Vite Development Server. When you run `npm run build`, Vite compiles your React code into static HTML/JS files. The Vite server (and its proxy) ceases to exist.

### **2. Production Strategy 1: The `cors` Package**
If your Frontend and Backend are on different domains (e.g., `front.com` and `api.back.com`), you MUST use the `cors` middleware in Express.

```javascript
// In backend/server.js
import cors from 'cors';

app.use(cors({
    origin: 'https://your-frontend-domain.com', // Whitelist your frontend
    methods: ['GET', 'POST']
}));
```

### **3. Production Strategy 2: Serving Static Files (Same Origin)**
This is a very common "Full Stack" deployment strategy. The Backend serves the Frontend.
1.  Run `npm run build` in React. This creates a `dist` folder.
2.  Copy the `dist` folder into the `backend` folder.
3.  Tell Express to serve those files:

```javascript
// In backend/server.js
app.use(express.static('dist'));

// Handle React Routing (send all unknown routes to index.html)
app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
});
```
In this scenario, both Frontend and Backend run on the **same port** (e.g., domain.com), so **CORS is not an issue** anymore.

### **4. Production Strategy 3: Nginx Reverse Proxy**
In large-scale apps, you put a server like **Nginx** in front of both.
*   Nginx listens on port 80.
*   Requests to `/` go to React.
*   Requests to `/api` go to Node.js.
Nginx handles the routing, eliminating CORS issues.

[1](https://www.youtube.com/watch?v=fFHyqhmnVfs)