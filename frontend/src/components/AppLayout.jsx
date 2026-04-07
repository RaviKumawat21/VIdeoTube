// frontend/src/components/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from './index.js';

function AppLayout() {
    return (
        <div className="h-screen flex flex-col bg-gray-950 text-white">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* The nested routes will render right here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;