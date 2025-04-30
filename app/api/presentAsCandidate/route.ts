import { NextRequest, NextResponse } from 'next/server';
import { getContractWithSigner } from '@/utils/contract';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Candidate name are required' }, { status: 400 });
        }

        const privateKey = process.env.WALLET_PRIVATE_KEY;

        if (!privateKey) {
            return NextResponse.json({ error: 'Server wallet configuration error' }, { status: 500 });
        }

        const contract = getContractWithSigner(privateKey);
        const tx = await contract.presentAsCandidate(name);
        const receipt = await tx.wait();

        return NextResponse.json({
            success: true,
            txHash: receipt.hash,
            message: 'Registered as candidate successfully',
        });
    } catch (error: any) {
        console.error('Error in presentAsCandidate API:', error);

        return NextResponse.json(
            {
                error: error.message || 'Failed to register as candidate',
                details: error.reason || error.code || null,
            },
            { status: 500 },
        );
    }
}
