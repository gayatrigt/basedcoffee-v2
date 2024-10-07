"use client";
import React, { useEffect, useState } from 'react'
import { VideoPlayer } from './FeedVideo';
import { data } from '~/fake/funding';
import ProposalCard from './FeedProposalCard';

const FeedWrapper = () => {

    const [inViewVideos, setInViewVideos] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const observers: Record<number, IntersectionObserver> = {};

        data.videos.forEach((video, index) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry) {
                        setInViewVideos(prev => ({ ...prev, [index]: entry.isIntersecting }));
                    }
                },
                { threshold: 0.6 }
            );

            const element = document.getElementById(`video-${index}`);
            if (element) {
                observer.observe(element);
                observers[index] = observer;
            }
        });

        return () => {
            Object.values(observers).forEach(observer => observer.disconnect());
        };
    }, []);

    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
            {data.videos.map((video, index) => {

                const proposal = data.proposals[index]

                return (
                    <div
                        key={index}
                        id={`video-${index}`}
                        className="h-screen w-full snap-start relative"
                    >
                        <VideoPlayer src={video} inView={inViewVideos[index] || false} />

                        {/* Panel */}
                        {proposal && <ProposalCard proposal={proposal} />}
                    </div>
                )
            })}
        </div>
    )
}

export default FeedWrapper