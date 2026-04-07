// frontend/src/components/Loader.jsx
import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

export default function Loader({ className = "" }) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <BiLoaderAlt className="animate-spin text-4xl text-amber-500" />
        </div>
    );
}