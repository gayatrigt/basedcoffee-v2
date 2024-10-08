import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';



interface Creator {
    name: string;
    wallet: string;
}

interface Link {
    label: string;
    value: string
}

interface Proposal {
    id: string;
    title: string;
    category: string;
    description: string;
    fullContent?: string;
    videoUrl?: string;
    goal: number;
    current: number;
    currency: string;
    deadline: string;
    creator: Creator;
    backers: number;
    website: string;
    links: Link[];
}

interface FeedProposalCardProps {
    proposal: Proposal;
}

const humanizeNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};


const FeedProposalCard: React.FC<FeedProposalCardProps> = ({ proposal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const progress = (proposal.current / proposal.goal) * 100;
    const timeLeft = formatDistanceToNow(new Date(proposal.deadline), { addSuffix: true });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCardClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleSupportButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();

    }

    return (
        <motion.div
            className="absolute bottom-0 left-0 w-full p-2"
            initial={{ y: 0 }}
            // animate={{ y: isExpanded ? -100 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <motion.div
                ref={cardRef}
                className=" text-white bg-slate-900/30 backdrop-blur-md border-2 border-slate-900/20 p-4 flex flex-col gap-2 pt-8 rounded-lg"
                whileHover={{ scale: 1.02 }}
                onClick={handleCardClick}
            >
                <h3 className='font-accent text-sm leading-6 tracking-wider mb-2'>{proposal.title}</h3>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.p
                            className='text-sm text-slate-300 mb-2'
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {proposal.description}
                        </motion.p>
                    )}
                </AnimatePresence>

                <div className='flex  justify-between items-center'>
                    <span className="bg-blue-100/50 text-blue-800 text-xs font-medium mr-2 px-4 py-1 rounded inline-block">
                        {proposal.category}
                    </span>
                    <span className='text-sm text-slate-100 ml-2'>{proposal.backers} backers</span>
                </div>

                <motion.div
                    layout
                >
                    <div className="w-full bg-gray-200/50 rounded-full h-2.5">
                        <motion.div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span>{humanizeNumber(proposal.current)} {proposal.currency}</span>
                        <span>Goal: {humanizeNumber(proposal.goal)} {proposal.currency}</span>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex justify-between items-center text-sm mt-2">
                                <div className="flex items-center text-sm text-slate-700">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{proposal.creator.name}</span>
                                </div>
                                <span>{timeLeft}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSupportButton}
                    className='bg-blue-600 text-white/80 py-2 w-full mt-2 rounded-md'
                >
                    Send a Cofffee
                </motion.button>
            </motion.div>
        </motion.div >
    );
};


export default FeedProposalCard;