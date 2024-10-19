import React, { ReactNode } from 'react';

// Custom Dialog Components
export const Dialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }> = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                {children}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export const DialogTrigger: React.FC<{ asChild?: boolean; children: ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

export const DialogContent: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <div className="space-y-4">{children}</div>;
};

export const DialogHeader: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <div className="mb-4">{children}</div>;
};

export const DialogTitle: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <h2 className="text-lg font-semibold">{children}</h2>;
};

// Custom Input Component
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

// Custom Button Component
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            {children}
        </button>
    );
};