import { NextPage } from 'next';
import React from 'react';
import { IoLogInSharp } from 'react-icons/io5';
import ProposalCard from "~/components/FeedProposalCard";
import { FeedVideo } from '~/components/FeedVideo';
import { Proposal } from '~/components/FeedWrapper';
import ProposalShareButton from '~/components/ProposalShareButton';
import { getHost } from '~/utils/getHost';

const FeedPage: NextPage<{ params: { fundId: string } }> = async ({ params }) => {
    let parsedFundId = String(params.fundId);
    const proposalRes = await fetch(getHost() + `/api/proposals/${parsedFundId}`).then(res => res.json());
    console.log("🚀 ~ constFeedPage:NextPage<{params:{fundId:string}}>= ~ proposalRes:", proposalRes)
    const proposal: Proposal = proposalRes.proposal;

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

    // redirec to 404
    if (!proposal) {
        return null;
    }



    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-900">
            <div className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory">
                <div
                    key={proposal.id}
                    id={`video-${proposal.id}`}
                    className="h-[100dvh] w-full snap-start relative"
                >
                    {proposal.videoUrl && (
                        <FeedVideo
                            src={proposal.videoUrl}
                            inView
                        />
                    )}

                    <ProposalCard
                        proposal={proposal}
                        secondaryButton={
                            <ProposalShareButton proposal={proposal} variant='default' />
                        }
                    />
                </div>
            </div>
        </main>
    );
}

export default FeedPage;
