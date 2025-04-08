'use client';
import React from 'react';

import { toast } from 'sonner';

import GenericModal from '@/components/generic-modal';

import Candidate from './candidate';

import { CANDIDATES } from '../constants';

type Props = {
    handleVote: (candidate: number) => Promise<string | null>;
};

export default function VoteModal({ handleVote }: Props) {
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
        const txId = await handleVote(CANDIDATES[selectedCandidate].value);
        toast.dismiss();
        if (!txId) {
            alert('Transaction failed. Please try again.');
            return;
        } else {
            toast.success('Vote successfully casted! Check your wallet for the transaction.');
        }
    };

    return (
        <GenericModal title="Vote for your candidate" description="Vote for your candidate and make your voice heard!" btn_text="Vote" btn_action={confirmVote}>
            <div className="flex flex-col gap-4 py-8">
                {CANDIDATES.map((candidate, i) => (
                    <Candidate key={i} candidate={candidate} selected={selectedCandidate === i} handleSelectCandidate={() => handleSelectCandidate(i)} />
                ))}
            </div>
        </GenericModal>
    );
}
