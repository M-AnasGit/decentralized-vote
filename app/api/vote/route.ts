import { NextRequest, NextResponse } from 'next/server';
import { getContractWithSigner } from '@/utils/contract';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { candidateAddress } = body;

        if (!candidateAddress) {
            return NextResponse.json({ error: 'Candidate address are required' }, { status: 400 });
        }

        const privateKey = process.env.WALLET_PRIVATE_KEY;

        if (!privateKey) {
            return NextResponse.json({ error: 'Server wallet configuration error' }, { status: 500 });
        }

        const contract = getContractWithSigner(privateKey);

        const tx = await contract.vote(candidateAddress);
        const receipt = await tx.wait();

        return NextResponse.json({
            success: true,
            txHash: receipt.hash,
            message: 'Vote cast successfully',
        });
    } catch (error: any) {
        console.error('Error in vote API:', error);

        return NextResponse.json(
            {
                error: error.message || 'Failed to cast vote',
                details: error.reason || error.code || null,
            },
            { status: 500 },
        );
    }
}
