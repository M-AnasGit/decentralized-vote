'use client';
import React from 'react';

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

        const txId = await handleVote(CANDIDATES[selectedCandidate].value);
        if (!txId) {
            alert('Transaction failed. Please try again.');
            return;
        } else {
            window.open(`https://testnet.algoexplorer.io/tx/${txId}`, '_blank');
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
