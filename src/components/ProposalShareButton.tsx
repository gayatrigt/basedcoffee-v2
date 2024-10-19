"use client";
import React from 'react'
import { CiShare1 } from 'react-icons/ci';
import { getHost } from '~/utils/getHost';
import { Proposal } from './FeedWrapper';

interface ProposalShareButtonProps {
    proposal: Pick<Proposal, 'title' | 'id'>;
}
const ProposalShareButton: React.FC<ProposalShareButtonProps> = ({ proposal }) => {
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
    return (
        <button
            className='border-2 text-base rounded-md bg-white/20 text-blue-600 border-blue-600 font-semibold backdrop-blur-sm hover:border-blue-500 h-12 w-12 flex items-center justify-center text-center aspect-square'
            onClick={handleShare}
        >
            <CiShare1 stroke="8" className="h-5 w-5 stroke-blue-600 stroke-1" />
        </button>
    )
}

export default ProposalShareButton