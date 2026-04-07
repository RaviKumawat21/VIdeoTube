import React from "react";

import { Link } from "react-router-dom";

function Header(){
    return(
        <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-amber-500">
                VideoTube
            </Link>
            <nav>
                 {/* Temporary auth buttons for layout testing */}
                <Link to="/login" className="px-4 py-2 hover:bg-gray-800 rounded">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded ml-2">Sign Up</Link>
            </nav>
        </header>
    )
}
export default Header;