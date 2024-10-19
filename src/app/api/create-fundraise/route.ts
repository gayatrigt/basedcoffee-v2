import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function POST(request: Request) {
    try {
        const { title, category, description, amount, videoUrl, walletAddress, name } = await request.json();

        if (!walletAddress) {
            return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
        }

        // Find or create user
        let user = await db.user.findUnique({
            where: { walletAddress },
        });

        if (!user) {
            user = await db.user.create({
                data: { walletAddress, name },
            });
        }

        // Calculate end date (2 weeks from now)
        const endAt = new Date();
        endAt.setDate(endAt.getDate() + 14);

        // Create fundraise for the user
        const fundraise = await db.fundraise.create({
            data: {
                title,
                category,
                description,
                amount,
                videoUrl,
                userId: user.id,
                endAt: endAt,
                twitter: "twitter",
                farcaster: "fc",
                website: "web",
                currency: "INR"
            },
        });

        return NextResponse.json({ fundraise, user });
    } catch (error) {
        console.error('Error creating fundraise:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}