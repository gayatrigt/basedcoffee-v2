"use client";
import React, { useEffect, useState } from 'react'
import ProposalCard from './FeedProposalCard';
import { FeedVideo } from './FeedVideo';
import Link from "next/link"

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

const FeedWrapper = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [inViewVideos, setInViewVideos] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await fetch('/api/proposals');
                if (!response.ok) {
                    throw new Error('Failed to fetch proposals');
                }
                const data = await response.json();
                setProposals(data);
            } catch (err) {
                setError('Failed to load proposals. Please try again later.');
                console.error('Error fetching proposals:', err);
            } finally {
                setLoading(false);
            }
        };

        void fetchProposals();
    }, []);

    useEffect(() => {
        const observers: Record<string, IntersectionObserver> = {};

        proposals.forEach((proposal) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry) {
                        setInViewVideos(prev => ({ ...prev, [proposal.id]: entry.isIntersecting }));
                    }
                },
                { threshold: 0.6 }
            );

            const element = document.getElementById(`video-${proposal.id}`);
            if (element) {
                observer.observe(element);
                observers[proposal.id] = observer;
            }
        });

        return () => {
            Object.values(observers).forEach(observer => observer.disconnect());
        };
    }, [proposals]);

    if (loading) {
        return <div className='text-white font-accent text-2xl text-left px-6'>Fetching Proposals</div>;
    }

    if (proposals.length === 0) {
        return <div className='text-white text-left px-6'>
            <span className="text-lg text-balance leading-10 font-accent">There are no active proposals right now</span>
            <Link href='/create'
                className='block px-4 bg-blue-600 text-white/80 py-2 w-full rounded-md border-2 border-blue-600 hover:bg-blue-700 mt-6'
            // className='border-2 py-2 rounded-md bg-white/20 border-slate-600 backdrop-blur-sm text-white hover:border-slate-200 w-full text-sm mt-4'
            >
                Add your proposal
            </Link>
        </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory">
            {proposals.map((proposal) => (
                <div
                    key={proposal.id}
                    id={`video-${proposal.id}`}
                    className="h-[100dvh] w-full snap-start relative"
                >
                    {proposal.videoUrl && (
                        <FeedVideo
                            src={proposal.videoUrl}
                            inView={inViewVideos[proposal.id] ?? false}
                        />
                    )}

                    <ProposalCard proposal={proposal} />
                </div>
            ))}
        </div>
    )
}

export default FeedWrapper