import { NextResponse } from 'next/server';
import { getContract, formatCandidates } from '@/utils/contract';

export async function GET() {
    try {
        const contract = getContract();
        const [candidateList, voteCounts, fixedStatus, candidateNames] = await contract.getVoteResults();
        const candidates = formatCandidates(candidateList, voteCounts, fixedStatus, candidateNames);

        return NextResponse.json({
            success: true,
            candidates,
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
