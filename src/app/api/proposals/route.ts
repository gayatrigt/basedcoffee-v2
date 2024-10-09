import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET() {
    try {
        const fundraises = await db.fundraise.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 10, // Limit to 10 most recent fundraises
            include: {
                user: true,
                supports: true
            }
        });

        const proposals = fundraises.map(fundraise => ({
            id: fundraise.id,
            title: fundraise.title,
            category: fundraise.category,
            description: fundraise.description,
            fullContent: undefined,
            videoUrl: fundraise.videoUrl,
            notionUrl: undefined,
            goal: fundraise.amount,
            current: fundraise.supports.reduce((sum, support) => sum + support.amount, 0),
            currency: fundraise.currency,
            deadline: fundraise.endAt.toISOString(),
            creator: {
                name: fundraise.user.name ?? 'Anonymous',
                wallet: fundraise.user.walletAddress
            },
            backers: fundraise.supports.length
        }));

        return NextResponse.json(proposals);
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}