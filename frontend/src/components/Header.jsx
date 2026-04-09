import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from '../utils/axios.instance';
import { logout } from '../store/authSlice';
import Logo from './Logo';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Read from Redux Store!
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    const handleLogout = async () => {
        try {
            // Hit the logout route to clear backend cookies
            await axiosInstance.post("/users/logout");
            // Clear the Redux store
            dispatch(logout());
            // Send them back to Login screen
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
            <Link to="/" className="flex items-center gap-2">
                <Logo />
            </Link>
            
            <nav className="flex items-center space-x-4">
                {authStatus ? (
                    // LOGGED IN VIEW
                    <>
                        <div className="flex items-center gap-3 mr-4">
                            <span className="hidden sm:block text-gray-300 text-sm">
                                Welcome back, <span className="text-white font-semibold">{userData?.username}</span>
                            </span>
                            {/* If they added an avatar during Signup, display it! */}
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500">
                                <img 
                                    src={userData?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                                    alt="User Avatar" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm font-medium rounded-lg transition-colors"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    // LOGGED OUT VIEW
                    <>
                        <Link to="/login" className="px-4 py-2 hover:bg-gray-800 text-sm font-medium rounded-lg transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-sm font-medium shadow-lg rounded-lg transition-colors">
                            Sign Up
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;