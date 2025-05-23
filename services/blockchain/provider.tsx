'use client';
import React from 'react';
import { ethers } from 'ethers';
import { useUserData } from '../user/provider';
import { contractABI, formatCandidates } from '@/utils/contract';
import { format } from 'path';

type ProviderProps = React.PropsWithChildren<{}>;

export type Candidate = {
    address: string;
    name: string;
    voteCount: number;
    isFixed: boolean;
};

type BlockchainContextType = {
    handleBlockchainVote: (candidateAddress: string) => Promise<string | null>;
    handleGetVoteResults: () => Promise<Candidate[] | null>;
    handlePresentAsCandidate: (name: string) => Promise<string | null>;
    handleRemoveCandidate: () => Promise<string | null>;
    loading: boolean;
    error: string | null;
    candidates: Candidate[];
    refreshCandidates: () => Promise<void>;
};

const BlockchainContext = React.createContext<BlockchainContextType | undefined>(undefined);

const BlockchainProvider = ({ children }: ProviderProps) => {
    const { user, signer } = useUserData();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [candidates, setCandidates] = React.useState<Candidate[]>([]);

    const refreshCandidates = async () => {
        try {
            const results = await handleGetVoteResults();
            if (results) {
                setCandidates(results);
            }
        } catch (err) {
            console.error('Failed to refresh candidates:', err);
        }
    };

    React.useEffect(() => {
        refreshCandidates();
    }, [user, signer]);

    const handleBlockchainVote = async (candidateAddress: string): Promise<string | null> => {
        if (!user || !signer) {
            setError('Please connect your wallet first.');
            return null;
        }

        setLoading(true);
        setError(null);

        console.log('Voting for candidate:', candidateAddress);

        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidateAddress }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to prepare transaction');
            }

            const txData = await response.json();
            const tx = await signer.sendTransaction({
                to: txData.to,
                data: txData.data,
                value: txData.value || '0x0',
            });

            const receipt = await tx.wait(1);
            console.log('Vote successful:', receipt);
            return receipt.transactionHash;
        } catch (error: any) {
            setError(error.message || 'An error occurred while voting');
            console.error('Voting error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGetVoteResults = async (): Promise<Candidate[] | null> => {
        if (!user || !signer) {
            setError('Please connect your wallet first.');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/getVoteResults');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to prepare transaction');
            }

            const txData = await response.json();
            const contract = new ethers.Contract(txData.to, contractABI, signer);
            const [candidateList, voteCounts, fixedStatus, candidateNames] = await contract.getVoteResults();

            console.log(candidateList, voteCounts, fixedStatus, candidateNames);

            return formatCandidates(candidateList, voteCounts, fixedStatus, candidateNames);
        } catch (error: any) {
            setError(error.message || 'An error occurred while getting vote results');
            console.error('Error fetching vote results:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handlePresentAsCandidate = async (name: string): Promise<string | null> => {
        if (!user || !signer) {
            setError('Please connect your wallet first.');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/presentAsCandidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to prepare transaction');
            }

            const txData = await response.json();
            const tx = await signer.sendTransaction({
                to: txData.to,
                data: txData.data,
                value: txData.value || '0x0',
            });

            const receipt = await tx.wait(1);
            console.log('Presented successfully:', receipt);
            await refreshCandidates();

            return receipt.transactionHash;
        } catch (error: any) {
            setError(error.message || 'An error occurred while registering as candidate');
            console.error('Registration error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCandidate = async (): Promise<string | null> => {
        if (!user || !signer) {
            setError('Please connect your wallet first.');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/removeCandidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to prepare transaction');
            }

            const txData = await response.json();
            const tx = await signer.sendTransaction({
                to: txData.to,
                data: txData.data,
                value: txData.value || '0x0',
            });

            const receipt = await tx.wait(1);
            console.log('Removed successfully:', receipt);
            await refreshCandidates();

            return receipt.transactionHash;
        } catch (error: any) {
            setError(error.message || 'An error occurred while removing candidacy');
            console.error('Removal error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        handleBlockchainVote,
        handleGetVoteResults,
        handlePresentAsCandidate,
        handleRemoveCandidate,
        loading,
        error,
        candidates,
        refreshCandidates,
    };

    return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};

export default BlockchainProvider;

export const useBlockchain = () => {
    const context = React.useContext(BlockchainContext);
    if (!context) {
        throw new Error('useBlockchain must be used within a BlockchainProvider');
    }
    return context;
};
