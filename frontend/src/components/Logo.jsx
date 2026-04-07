import React from 'react';
import { BiPlayCircle } from 'react-icons/bi';

export default function Logo({ className = "" }) {
    return (
        <div className={`flex items-center gap-2 font-bold text-amber-500 ${className}`}>
            <BiPlayCircle className="text-3xl" />
            <span>VideoTube</span>
        </div>
    );
}