'use client'

import { NextPage } from 'next';
import { useState } from 'react';
import ProposalCard from "~/components/FeedProposalCard";
import { FeedVideo } from '~/components/FeedVideo';
import { Proposal } from '~/components/FeedWrapper';
import ProposalShareButton from '~/components/ProposalShareButton';
import { getHost } from '~/utils/getHost';

const FeedPage: NextPage<{ params: { fundId: string } }> = async ({ params }) => {
    const parsedFundId = String(params.fundId);
    const proposalRes = await fetch(getHost() + `/api/proposals/${parsedFundId}`).then(res => res.json());
    const proposal: Proposal = proposalRes.proposal;

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
                    className="h-[100dvh] w-full snap-start relative  md:flex items-stretch md:max-w-3xl md:space-x-6 mx-auto"
                >
                    {proposal.videoUrl && (
                        <FeedVideo
                            proposal={proposal}
                            src={proposal.videoUrl}
                            inView={true}
                        />
                    )}

                    <ProposalCard
                        proposal={proposal}
                        inView={true}
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
