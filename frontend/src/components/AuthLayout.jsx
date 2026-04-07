// frontend/src/components/AuthLayout.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        // If route requires auth, but user is NOT logged in
        if (authentication && authStatus !== authentication) {
            navigate('/login');
        } 
        // If route does NOT require auth (like login page), but user IS logged in
        else if (!authentication && authStatus !== authentication) {
            navigate('/');
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? <div className="text-white text-center mt-10">Loading...</div> : <>{children}</>;
}