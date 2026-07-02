import React from 'react';

export default function PrimaryButton({ children, className, disabled, onClick, type = 'submit' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`d-inline-flex align-items-center rounded-2 border-0 bg-dark px-3 py-2 small fw-semibold text-uppercase text-white transition hover-bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${className || ''}`}
        >
            {children}
        </button>
    );
}
