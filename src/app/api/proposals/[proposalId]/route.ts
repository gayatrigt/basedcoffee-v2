import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(
    _request: NextRequest,
    { params }: { params: { proposalId: string } }
) {
    const { proposalId } = params;
    try {
        const fundraise = await db.fundraise.findFirst({
            where: {
                id: proposalId,
                contract: {
                    not: {
                        equals: ""
                    },
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        });

        if (!fundraise) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        const supportStats = await db.support.aggregate({
            where: {
                fundraiseId: proposalId
            },
            _count: {
                id: true
            },
            _sum: {
                amount: true
            }
        });

        const proposal = {
            id: fundraise.id,
            title: fundraise.title,
            category: fundraise.category,
            description: fundraise.description,
            fullContent: undefined,
            videoUrl: fundraise.videoUrl,
            notionUrl: undefined,
            goal: fundraise.amount,
            goalInr: fundraise.amountINR,
            goalUSD: fundraise.amountUSDC,
            current: supportStats._sum.amount,
            currency: fundraise.currency,
            deadline: fundraise.endAt.toISOString(),
            creator: {
                name: fundraise.user.name ?? 'Anonymous',
                wallet: fundraise.user.walletAddress
            },
            backers: supportStats._count.id,
            contract: fundraise.contract
        }


        return NextResponse.json({ proposal });
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}