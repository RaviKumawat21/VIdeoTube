// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="w-64 hidden sm:block h-screen sticky top-[60px] border-r border-gray-700 bg-gray-900 text-white p-4">
            <ul className="flex flex-col gap-4">
                <li><Link to="/" className="hover:text-amber-500">Home</Link></li>
                <li><Link to="/liked-videos" className="hover:text-amber-500">Liked Videos</Link></li>
                <li><Link to="/history" className="hover:text-amber-500">History</Link></li>
                <li><Link to="/dashboard" className="hover:text-amber-500">Dashboard</Link></li>
            </ul>
        </aside>
    );
}

export default Sidebar;