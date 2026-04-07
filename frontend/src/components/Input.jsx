// frontend/src/components/Input.jsx
import React, { useId, forwardRef } from 'react';

const Input = forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
}, ref) {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label className="block mb-1 text-sm text-gray-300" htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3 py-2 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 border border-gray-700 w-full ${className}`}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    );
});

export default Input;