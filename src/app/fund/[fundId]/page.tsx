import { NextPage } from 'next';
import React from 'react';
import ProposalCard from "~/components/FeedProposalCard";
import { FeedVideo } from '~/components/FeedVideo';
import { db } from '~/server/db';



const FeedPage: NextPage<{ params: { fundId: string } }> = async ({ params }) => {
    let parsedFundId = String(params.fundId);
    const proposal = await db.fundraise.findFirst({ where: { id: parsedFundId } });
    console.log("🚀 ~ constFeedPage:NextPage<{params:{fundId:string}}>= ~ proposal:", proposal)

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

                    <ProposalCard proposal={proposal} />
                </div>
            </div>
        </main>
    );
}

export default FeedPage;
