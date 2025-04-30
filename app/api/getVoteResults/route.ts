import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import { CONTRACT_ADDRESS, contractABI } from '@/utils/contract';

export async function GET() {
    try {
        const contractInterface = new ethers.utils.Interface(contractABI);

        const data = contractInterface.encodeFunctionData('getAllCandidates');
        return NextResponse.json({
            to: CONTRACT_ADDRESS,
            data: data,
            value: '0',
        });
    } catch (error: any) {
        console.error('Error in getVoteResults API:', error);

        return NextResponse.json(
            {
                error: error.message || 'Failed to get vote results',
                details: error.reason || error.code || null,
            },
            { status: 500 },
        );
    }
}
