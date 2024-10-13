import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function POST(request: NextRequest) {
    try {
        const { userAddress, contract, amount, txnHash } = await request.json();

        // Validate input
        if (!userAddress || !contract || !amount || !txnHash) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Convert amount to a number
        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount)) {
            return NextResponse.json({ error: 'Invalid amount provided' }, { status: 400 });
        }

        // Find the user by wallet address
        const user = await db.user.findUnique({
            where: { walletAddress: userAddress }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find the fundraise by contract
        const fundraise = await db.fundraise.findFirst({
            where: { contract: contract }
        });

        if (!fundraise) {
            return NextResponse.json({ error: 'Fundraise not found' }, { status: 404 });
        }

        // Create new Support record
        const support = await db.support.create({
            data: {
                amount: amount,
                userId: user.id,
                fundraiseId: fundraise.id,
                tnxhash: txnHash
            }
        });

        return NextResponse.json({
            message: 'Support created successfully',
            support: {
                id: support.id,
                amount: support.amount,
                createdAt: support.createdAt,
                userId: support.userId,
                fundraiseId: support.fundraiseId,
                tnxhash: support.tnxhash
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating support:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}