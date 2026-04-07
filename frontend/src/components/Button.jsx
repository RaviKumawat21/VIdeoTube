// frontend/src/components/Button.jsx
import React from 'react';

export default function Button({
    children,
    type = 'button',
    bgColor = 'bg-amber-600',
    textColor = 'text-white',
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}