'use client';
import React from 'react';

import { toast } from 'sonner';

import GenericModal from '@/components/generic-modal';

import Candidate from './candidate';

type Props = {
    candidates: any[];
    handleVote: (candidateAddress: string) => Promise<string | null>;
};

export default function VoteModal({ candidates, handleVote }: Props) {
    const [selectedCandidate, setSelectedCandidate] = React.useState<number | null>(null);
    const handleSelectCandidate = (index: number) => {
        setSelectedCandidate(index);
    };

    const confirmVote = async () => {
        if (selectedCandidate === null) {
            alert('Please select a candidate before voting!');
            return;
        }

        toast.info('Voting... Please wait.', {
            duration: 2000000,
        });
        const txId = await handleVote(candidates[selectedCandidate].address);
        toast.dismiss();
        if (!txId) {
            alert('Transaction failed. You have already voted!');
            return;
        } else {
            toast.success('Vote successfully casted! Check your wallet for the transaction.');
        }
    };

    return (
        <GenericModal title="Vote for your candidate" description="Vote for your candidate and make your voice heard!" btn_text="Vote" btn_action={confirmVote}>
            <div className="flex flex-col gap-4 py-8">
                {candidates.map((candidate, i) => (
                    <Candidate key={i} candidate={candidate} selected={selectedCandidate === i} handleSelectCandidate={() => handleSelectCandidate(i)} />
                ))}
            </div>
        </GenericModal>
    );
}
