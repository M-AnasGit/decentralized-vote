import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import { contractABI, CONTRACT_ADDRESS } from '@/utils/contract';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { candidateAddress } = body;

        if (!candidateAddress) {
            return NextResponse.json({ error: 'Candidate address is required' }, { status: 400 });
        }

        const contractInterface = new ethers.utils.Interface(contractABI);

        const data = contractInterface.encodeFunctionData('vote', [candidateAddress]);
        return NextResponse.json({
            to: CONTRACT_ADDRESS,
            data: data,
            value: '0',
        });
    } catch (error: any) {
        console.error('Error preparing vote transaction:', error);
        return NextResponse.json(
            {
                error: error.message || 'Failed to prepare vote transaction',
                details: error.reason || error.code || null,
            },
            { status: 500 },
        );
    }
}
