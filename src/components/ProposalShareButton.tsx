"use client";
import React from 'react'
import { CiShare1 } from 'react-icons/ci';
import { getHost } from '~/utils/getHost';
import { Proposal } from './FeedWrapper';
import { IoShareSocial } from 'react-icons/io5';

interface ProposalShareButtonProps {
    proposal: Pick<Proposal, 'title' | 'id'>;
    variant: 'default' | 'blue';
}

const ProposalShareButton: React.FC<ProposalShareButtonProps> = ({ proposal, variant }) => {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: proposal.title,
                    url: getHost() + `/fund/${proposal.id}`,
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.log('Error sharing content:', error);
            }
        } else {
            console.log('Web Share API not supported');
            // Fallback behavior here (e.g., copy to clipboard)
        }
    };

    const buttonClasses = {
        default: 'bg-white/20 hover:border-blue-500 backdrop-blur-sm h-10 w-10 text-white',
        blue: 'bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white h-12 w-12 text-blue-600',
    };

    return (
        <button
            className={`text-base rounded-md font-semibold transition-colors duration-200 flex items-center justify-center text-center aspect-square ${buttonClasses[variant]}`}
            onClick={handleShare}
        >
            <IoShareSocial className="h-5 w-5" />
        </button>
    )
}

export default ProposalShareButton