'use client';
import React from 'react';
import algosdk from 'algosdk';

import { useUserData } from '../auth/provider';

type ProviderProps = React.PropsWithChildren<{}>;

type BlockchainContextType = {
    register: () => void;
};

const BlockchainContext = React.createContext<BlockchainContextType | undefined>(undefined);

const BlockchainProvider = ({ children }: ProviderProps) => {
    const { user } = useUserData();
    const client = React.useMemo(() => new algosdk.Algodv2(process.env.NEXT_PUBLIC_ALGOD_TOKEN!, process.env.NEXT_PUBLIC_BASE_SERVER!, process.env.NEXT_PUBLIC_PORT!), []);

    const optIn = async (sender: string, index: number) => {
        try {
            let params = await client.getTransactionParams().do();
            params.fee = BigInt(1000);
            params.flatFee = true;

            let txn = algosdk.makeApplicationOptInTxnFromObject({
                sender: sender,
                appIndex: index,
                suggestedParams: params,
            });

            const txn_b64 = await window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());
            let signedTxs = await window.AlgoSigner.signTxn([{ txn: txn_b64 }]);

            let binarySignedTx = await window.AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
            let txId = await client.sendRawTransaction(binarySignedTx).do();

            await algosdk.waitForConfirmation(client, txId.txid, 4);
            await client.pendingTransactionInformation(txId.txid).do();
        } catch (err) {
            console.log(err);
        }
    };
    const register = () => {
        if (user) optIn(user.address, parseInt(process.env.NEXT_PUBLIC_APP_ID!));
    };

    return <BlockchainContext.Provider value={{ register }}>{children}</BlockchainContext.Provider>;
};

export default BlockchainProvider;

export const useBlockchain = () => {
    const context = React.useContext(BlockchainContext);
    if (!context) {
        throw new Error('useBlockchain must be used within a BlockchainProvider');
    }
    return context;
};
