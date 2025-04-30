'use client';
import React from 'react';

import GenericModal from '@/components/generic-modal';
import CandidateResult from './candidate-result';

import { Loader2 } from 'lucide-react';

import { Candidate } from '@/services/blockchain/provider';

type Props = {
    handleGetVotes: () => Promise<Candidate[] | null>;
};

export default function ResultModal({ handleGetVotes }: Props) {
    const [loading, setLoading] = React.useState(false);
    const [votes, setVotes] = React.useState<Candidate[] | null>(null);

    React.useEffect(() => {
        const fetchVotes = async () => {
            setLoading(true);
            const result = await handleGetVotes();
            setVotes(result);
            setLoading(false);
        };

        fetchVotes();
    }, []);

    return (
        <GenericModal title="Current vote results" description="Check the current vote results">
            {loading ? (
                <div className="w-full flex items-center justify-center  py-8">
                    <Loader2 className="animate-spin text-primary" size={38} />
                </div>
            ) : votes ? (
                <div className="flex flex-col gap-4 py-8">
                    {votes.map((v, i) => (
                        <CandidateResult key={i} candidate={v} votes={v.voteCount} />
                    ))}
                </div>
            ) : (
                <small role="alert" className="text-sm text-destructive">
                    Error fetching votes. Please try again later.
                </small>
            )}
        </GenericModal>
    );
}
