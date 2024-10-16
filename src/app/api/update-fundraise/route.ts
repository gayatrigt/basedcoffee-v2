import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/server/db'

export async function POST(request: NextRequest) {
    try {
        const { id, txnHash, contract } = await request.json()

        if (!id || !txnHash || !contract) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        const updatedFundraise = await db.fundraise.update({
            where: { id: id },
            data: {
                txnHash: txnHash,
                contract
                // You can update other fields here if needed
            },
        })

        return NextResponse.json(updatedFundraise, { status: 200 })
    } catch (error) {
        console.error('Error updating fundraise:', error)
        return NextResponse.json({ message: 'Error updating fundraise', error: error }, { status: 500 })
    } finally {
        await db.$disconnect()
    }
}