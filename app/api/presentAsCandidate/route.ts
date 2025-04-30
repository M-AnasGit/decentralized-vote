import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import { CONTRACT_ADDRESS, contractABI } from '@/utils/contract';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const contractInterface = new ethers.utils.Interface(contractABI);

        const data = contractInterface.encodeFunctionData('presentAsCandidate', [name]);
        return NextResponse.json({
            to: CONTRACT_ADDRESS,
            data: data,
            value: '0',
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
