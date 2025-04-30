import { NextRequest, NextResponse } from 'next/server';
import { getContractWithSigner } from '@/utils/contract';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userAddress } = body;

        if (!userAddress) {
            return NextResponse.json({ error: 'User address is required' }, { status: 400 });
        }

        const privateKey = process.env.WALLET_PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json({ error: 'Server wallet configuration error' }, { status: 500 });
        }

        const contract = getContractWithSigner(privateKey);

        const tx = await contract.removeCandidate();
        const receipt = await tx.wait();

        return NextResponse.json({
            success: true,
            txHash: receipt.hash,
            message: 'Candidacy removed successfully',
        });
    } catch (error: any) {
        console.error('Error in removeCandidate API:', error);

        return NextResponse.json(
            {
                error: error.message || 'Failed to remove candidacy',
                details: error.reason || error.code || null,
            },
            { status: 500 },
        );
    }
}
