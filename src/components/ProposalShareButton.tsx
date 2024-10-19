"use client";
import React from 'react'
import { CiShare1 } from 'react-icons/ci';
import { getHost } from '~/utils/getHost';
import { Proposal } from './FeedWrapper';
import { IoShareSocial } from 'react-icons/io5';

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
            className='text-base rounded-md bg-white/20 text-white font-semibold backdrop-blur-sm hover:border-blue-500 h-10 w-10 flex items-center justify-center text-center aspect-square'
            onClick={handleShare}
        >
            <IoShareSocial className="h-5 w-5" />
        </button>
    )
}

export default ProposalShareButton