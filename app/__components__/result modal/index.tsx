'use client';
import React from 'react';

import GenericModal from '@/components/generic-modal';
import { Loader2 } from 'lucide-react';
import CandidateResult from './candidate-result';
import { CANDIDATES } from '../constants';

type Props = {
    handleGetVotes: () => Promise<Record<string, number> | null>;
};

export default function ResultModal({ handleGetVotes }: Props) {
    const [loading, setLoading] = React.useState(false);
    const [votes, setVotes] = React.useState<Record<string, number> | null>(null);

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
                    {Object.entries(votes).map(([k, v], i) => (
                        <CandidateResult key={i} candidate={CANDIDATES.find((candidate) => candidate.party === k)} votes={v} />
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
