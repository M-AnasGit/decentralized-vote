import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import { CONTRACT_ADDRESS, contractABI } from '@/utils/contract';

export async function POST(request: NextRequest) {
    try {
        const contractInterface = new ethers.utils.Interface(contractABI);

        const data = contractInterface.encodeFunctionData('removeCandidate');
        return NextResponse.json({
            to: CONTRACT_ADDRESS,
            data: data,
            value: '0',
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
