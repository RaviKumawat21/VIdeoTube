import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  // A small helper to safely format the duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <Link
      to={`/video/${video._id}`}
      className="flex flex-col gap-2 cursor-pointer w-full group"
    >
      {/* Thumbnail Box */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Video Details Below Thumbnail */}
      <div className="flex gap-3 mt-1">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
         
          <img
            src={
              video.ownerDetails?.avatar ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            }
            alt={video.ownerDetails?.username || "Channel Avatar"}
            className="w-10 h-10 rounded-full object-cover"
          />
         
          <p className="hover:text-white transition-colors">
            {video.ownerDetails?.username || "Unknown Channel"}
          </p>
        </div>

        {/* Text Info */}
        <div className="flex flex-col text-sm text-gray-400">
          <h3 className="text-white font-semibold text-base line-clamp-2 leading-tight mb-1 group-hover:text-amber-500 transition-colors">
            {video.title}
          </h3>
          <p className="hover:text-white transition-colors">
            {video.ownerDetails?.username || video.owner?.username}
          </p>
          <p>
            {video.views || 0} views •{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
