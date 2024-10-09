"use client";
import React, { useEffect, useState } from 'react'
import ProposalCard from './FeedProposalCard';
import { FeedVideo } from './FeedVideo';

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

        fetchProposals();
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
        return <div>Loading...</div>;
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