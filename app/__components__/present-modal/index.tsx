'use client';
import React from 'react';

import { toast } from 'sonner';

import GenericModal from '@/components/generic-modal';
import { Input } from '@/components/ui/input';

type Props = {
    candidates: any[];
    handlePresentAsCandidate: (name: string) => Promise<string | null>;
};

export default function PresentModal({ candidates, handlePresentAsCandidate }: Props) {
    const [name, setName] = React.useState<string>('');
    const confirmVote = async () => {
        if (!name) {
            alert('Please select a candidate before voting!');
            return;
        }

        if (candidates.some((candidate) => candidate.name === name)) {
            alert('This name is already taken! Please choose another one.');
            return;
        }

        toast.info('Proceeding... Please wait.', {
            duration: 2000000,
        });
        const txId = await handlePresentAsCandidate(name);
        toast.dismiss();
        if (!txId) {
            alert('Transaction failed. You are already a candidate.');
            return;
        } else {
            toast.success('Transaction successful! You are now a candidate.');
        }
    };

    return (
        <GenericModal title="Become a candidate" description="Become a candidate so that other users can choose you" btn_text="Confirm" btn_action={confirmVote}>
            <Input name="name" type="text" placeholder="Enter your candidate name" value={name} onChange={(e) => setName(e.target.value)} />
        </GenericModal>
    );
}
