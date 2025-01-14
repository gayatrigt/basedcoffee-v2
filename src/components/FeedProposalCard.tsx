"use client";
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import SupportButton from './SupportButton';
// import SupportPopup from './SupportCardView';
import { CiCoffeeBean } from "react-icons/ci";
import SupportCardView from './SupportCardView';
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
    notionUrl?: string;
    goal: number;
    current: number;
    currency: string;
    deadline: string;
    creator: Creator;
    backers: number;
    contract: string;
    goalINR: number;
    goalUSD: number;
}


interface FeedProposalCardProps {
    proposal: Proposal;
    secondaryButton?: React.ReactNode;
    inView: boolean;
}

const humanizeNumber = (num?: number): string => {
    if (!num) {
        return '0';
    }
    num = parseFloat(num.toPrecision(3));
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const FeedProposalCard: React.FC<FeedProposalCardProps> = ({ proposal, secondaryButton, inView }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const progress = (proposal.current / proposal.goal) * 100;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    console.log("🚀 ~ proposal.deadline:", proposal.deadline)
    const timeLeft = proposal.deadline && formatDistanceToNow(new Date(proposal.deadline), { addSuffix: true });

    const handleClickOutside = (event: MouseEvent) => {
        console.log("🚀 ~ handleClickOutside ~ handleClickOutside:", handleClickOutside)
        if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
            setIsPopupOpen(false);
            setIsExpanded(false);
        }
    };

    useEffect(() => {

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCardClick = (event: React.MouseEvent) => {
        if (window.innerWidth < 500 && inView) {
            event.stopPropagation();
            setIsExpanded(!isExpanded);
        }

    };

    useEffect(() => {
        // check the innerWidth
        if (window.innerWidth > 500 && inView) {
            setIsExpanded(true)
        }

        if (!inView) {
            setIsExpanded(false)
            setIsPopupOpen(false)
        }
    }, [inView])

    return (
        <motion.div
            className="absolute bottom-0 left-0 w-full md:static flex-1"
            initial={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <motion.div
                ref={cardRef}
                className=" text-white bg-slate-900/30 backdrop-blur-md border-2 border-slate-900/20 p-4 pt-8 rounded-lg"
                onClick={handleCardClick}
            >

                {!!isPopupOpen && <SupportCardView
                    onClose={() => setIsPopupOpen(false)}
                    fundingContractAddress={proposal.contract}
                />}

                {!isPopupOpen && <div className='flex flex-col gap-2'>
                    <div className='flex relative'>
                        <h3 className='font-accent text-sm leading-6 tracking-wider mb-2'>{proposal.title}</h3>
                        {!isExpanded && (
                            <ChevronUp className='absolute right-0 h-6 w-6 text-white' />
                        )}
                        {isExpanded && (
                            <ChevronDown className='absolute right-0 h-6 w-6 text-white md:hidden block' />
                        )}
                    </div>

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

                    {isExpanded && (<div className='flex  justify-between items-center'>
                        <span className="bg-blue-100/50 text-blue-800 text-xs font-medium mr-2 px-4 py-1 rounded inline-block">
                            {proposal.category}
                        </span>
                        <span className='text-sm text-slate-100 ml-2'>{proposal.backers} backers</span>
                    </div>)}

                    <motion.div
                        layout
                    >
                        <div className="flex item-start space-x-4">
                            <div className='flex-1'>
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
                                    <span>{humanizeNumber(proposal.current)}</span>
                                    <span>Goal: {humanizeNumber(proposal.goal)} ETH</span>
                                </div>
                            </div>

                            {/* shrink by widh as they exit */}
                            {!isExpanded && <motion.button
                                onClick={() => setIsPopupOpen(true)}
                                className="aspect-square bg-blue-600 text-white p-2 rounded-md">
                                <CiCoffeeBean className='w-6 h-6' />
                            </motion.button>}
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
                                    <div className="flex items-center text-sm text-white">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                        </svg>
                                        <span className='text-white translate-y-[1px]'>{proposal.creator.name}</span>
                                    </div>
                                    <span>Ends {timeLeft}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {secondaryButton && <div className="flex item-start space-x-2">
                        <SupportButton onOpenPopup={() => setIsPopupOpen(true)} />
                        {secondaryButton}
                    </div>}

                    {!secondaryButton && isExpanded && <div>
                        <SupportButton onOpenPopup={() => setIsPopupOpen(true)} />
                    </div>}

                    {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSupportButton}
                    className='bg-blue-600 text-white/80 py-2 w-full mt-2 rounded-md'
                >
                    Send a Cofffee
                </motion.button> */}
                </div>}
            </motion.div>
        </motion.div >
    );
};


export default FeedProposalCard;