// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios.instance";
import { VideoCard, Loader } from "../components/index";

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axiosInstance.get("/videos");
                
                // Using the exact structure from your Postman response!
                const videoData = response.data.message.videos;
                
                setVideos(videoData); 
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch videos");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (!videos || videos.length === 0) {
        return <div className="text-center text-gray-400 mt-10">No videos available.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
}