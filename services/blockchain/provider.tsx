'use client';
import React from 'react';
import algosdk from 'algosdk';
import { useUserData } from '../user/provider';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const appIndex = parseInt(process.env.NEXT_PUBLIC_APP_ID!);

type ProviderProps = React.PropsWithChildren<{}>;

type BlockchainContextType = {
    handleBlockchainVote: (candidateId: number) => Promise<string | null>;
    getVotingResults: (appId: number) => Promise<Record<string, number> | null>;
};

const BlockchainContext = React.createContext<BlockchainContextType | undefined>(undefined);

const BlockchainProvider = ({ children }: ProviderProps) => {
    const { user, signTransaction } = useUserData();

    const hasOptedIn = async (address: string, appId: number): Promise<boolean> => {
        try {
            const info = await algodClient.accountApplicationInformation(address, appId).do();
            return !!info['appLocalState'];
        } catch (err: any) {
            if (err?.status === 404) {
                return false;
            }
            throw err;
        }
    };

    const optIn = async (appId: number) => {
        if (!user) {
            alert('Please connect your Algorand wallet first.');
            return null;
        }

        try {
            const suggestedParams = await algodClient.getTransactionParams().do();

            const txn = algosdk.makeApplicationOptInTxnFromObject({
                sender: user.address,
                appIndex: appId,
                suggestedParams,
            });

            const signedTxn = await signTransaction(txn);

            if (!signedTxn) {
                throw new Error('Transaction signing failed. Please try again.');
            }

            const simResult = await algodClient.simulateRawTransactions([signedTxn]).do();

            if (simResult.txnGroups[0].failureMessage) {
                throw new Error(`Simulation failed: ${simResult.txnGroups[0].failureMessage}`);
            }

            console.log('Simulation successful:', simResult);

            const { txid } = await algodClient.sendRawTransaction(signedTxn).do();
            const result = await algosdk.waitForConfirmation(algodClient, txid, 4);

            console.log('Opt-in successful:', result);
            return txid;
        } catch (error) {
            console.error('Opt-in error:', {
                error,
                appId,
                userAddress: user?.address,
            });
            return null;
        }
    };

    const handleBlockchainVote = async (partyNumber: number) => {
        if (!user) {
            alert('Please connect your Algorand wallet first.');
            return null;
        }

        try {
            if (partyNumber < 1 || partyNumber > 4) {
                throw new Error('Invalid party number. Must be 1-4');
            }

            const isOptedIn = await hasOptedIn(user.address, appIndex);

            if (!isOptedIn) {
                console.log('User not opted in. Initiating opt-in...');
                const optInTxId = await optIn(appIndex);
                if (!optInTxId) throw new Error('Opt-in failed.');
            }

            const appArgs = [new Uint8Array([partyNumber])];

            const suggestedParams = await algodClient.getTransactionParams().do();

            const txn = algosdk.makeApplicationNoOpTxnFromObject({
                sender: user.address,
                appIndex,
                appArgs,
                suggestedParams,
            });

            const signedTxn = await signTransaction(txn);

            if (!signedTxn) {
                throw new Error('Transaction signing failed. Please try again.');
            }

            const { txid } = await algodClient.sendRawTransaction(signedTxn).do();
            const result = await algosdk.waitForConfirmation(algodClient, txid, 4);

            console.log('Vote successful:', result);
            return txid;
        } catch (error) {
            console.error('Full voting error:', {
                error,
                partyNumber,
                userAddress: user?.address,
                appIndex: appIndex,
            });
            return null;
        }
    };

    const getVotingResults = async (appId: number): Promise<Record<string, number> | null> => {
        if (!user) {
            alert('Please connect your Algorand wallet first.');
            return null;
        }

        try {
            const appInfo = await algodClient.getApplicationByID(appId).do();
            const globalState = appInfo.params['globalState'];

            if (!globalState) {
                console.error('No global state found for the application');
                return null;
            }

            const decoder = new TextDecoder('utf-8');
            return globalState.reduce((acc: Record<string, number>, curr: algosdk.modelsv2.TealKeyValue) => {
                const str = decoder.decode(curr.key);

                return {
                    ...acc,
                    [str]: Number(curr.value.uint),
                };
            }, {});
        } catch (error) {
            console.error('Error fetching voting results:', error);
            return null;
        }
    };

    return <BlockchainContext.Provider value={{ handleBlockchainVote, getVotingResults }}>{children}</BlockchainContext.Provider>;
};

export default BlockchainProvider;

export const useBlockchain = () => {
    const context = React.useContext(BlockchainContext);
    if (!context) {
        throw new Error('useBlockchain must be used within a BlockchainProvider');
    }
    return context;
};
