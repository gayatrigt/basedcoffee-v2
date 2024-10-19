import React from 'react';

interface SupportButtonProps {
    onOpenPopup: () => void;
}

const SupportButton: React.FC<SupportButtonProps> = ({ onOpenPopup }) => {
    return (
        <button
            onClick={onOpenPopup}
            className="bg-blue-600 text-white py-2 px-4 w-full rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
            Send a Coffee
        </button>
    );
};

export default SupportButton;