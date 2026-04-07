## Plan: VideoTube Frontend Architecture & Implementation

A modern, highly-scalable React frontend consuming the VideoTube backend APIs, utilizing Tailwind CSS, Redux Toolkit, and React Router.

**Steps**

**Phase 1: Foundation & Dependencies**
1. Initialize core routing & state tools (*react-router-dom, @reduxjs/toolkit, react-redux*).
2. Configure Tailwind CSS (*tailwindcss, postcss, autoprefixer*).
3. Set up Axios for data fetching (*axios*), creating a custom instance with interceptors for JWT token handling (refresh tokens, auth headers).
4. *Optional but recommended:* Rename `componants/` folder to `components/` to match industry standards. Create `hooks/` and `utils/` folders.

**Phase 2: Core Configuration**
1. Set up the Redux `store` in `src/store/store.js`.
2. Create an `authSlice` to manage global user state (status: boolean, userData: object).
3. Set up environment variables in `.env` and map them in `src/conf/config.js` for safe API URL access.

**Phase 3: Routing & Layouts**
1. Define central routing using `createBrowserRouter` or `<Routes>` in `main.jsx`/`App.jsx`.
2. Build a foundational `AppLayout` component that includes the persistent `Header` (Navbar) and side navigation (`Sidebar`), wrapping an `<Outlet />`.
3. Create `AuthLayout` (protected routing wrapper) to prevent unauthenticated users from accessing private routes (Dashboard, liked videos) and vice-versa (Login/Register).

**Phase 4: Component Construction**
1. Build reusable UI components first: `Button`, `Input`, `Logo`, `VideoCard`, `Loader`, `Avatar`. *Parallel with next phase.*
2. Build Auth Components: Login Form, Registration Form (needs `multer` compatible file uploads for avatar/cover image).

**Phase 5: Page Implementation**
1. **Home Page**: Fetch all videos with pagination/infinite scroll, displaying them in a grid.
2. **Authentication Pages**: `Login` and `Signup`.
3. **Video Detailing Page**: Shows the video player, metadata, `Like`/`Subscribe` toggle buttons, and loops over the `Comments` feed.
4. **Channel Profile Page**: Displays user info, cover picture, subscriber count, and grid of uploaded videos.
5. **Dashboard (Studio)**: Table showing creator's videos (Upload, Edit, Delete), and grid showing channel statistics (from `getChannelStats`).
6. **Interaction Feeds**: `LikedVideos` page, `History` page, and `Playlists` list.

**Relevant files**
- [frontend/package.json](frontend/package.json) — Add React Router, Redux, Tailwind, Axios, React Icons.
- [frontend/src/store](frontend/src/store) — Requires Redux setup.
- [frontend/src/conf](frontend/src/conf) — Expose backend `VITE_API_URL` securely.

**Verification**
1. Verify Axios interceptors correctly refresh the access token when an API call returns a 401.
2. Verify protected routes redirect unauthenticated users back to Login.
3. Validate `.env` variables correctly resolve to the local backend port (e.g., `http://localhost:8000/api/v1`).

**Decisions**
- Use Redux for User Auth state, but keep API data fetching localized in component `useEffect` state (per user preference).
- Standard layout uses a persistent Left Sidebar and Top Header.

**Further Considerations**
1. Are you planning to upload video/image files directly mapping to Backend's `multer` fields ("avatar", "coverImage", "videoFile")? (This will require using `FormData` on the frontend Axios requests).
2. Given that you have multiple tables (Videos, Likes, Subscriptions), using a data table library like `ag-grid` or `react-table` might be beneficial for the Dashboard page. If not, raw Tailwind tables will suffice.
