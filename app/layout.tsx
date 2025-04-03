import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import UserProvider from '@/services/auth/provider';
import BlockchainProvider from '@/services/blockchain/provider';
import ErrorBoundary from '@/components/error-provider';

declare global {
    interface Window {
        AlgoSigner: {
            connect: () => Promise<void>;
            accounts: (params: { ledger: string }) => Promise<Array<{ address: string }>>;
            encoding: {
                msgpackToBase64: (txn: Uint8Array) => Promise<string>;
                base64ToMsgpack: (txn: string) => Promise<Uint8Array>;
            };
            signTxn: (txns: Array<{ txn: string }>) => Promise<Array<{ blob: string }>>;
        };
    }
}

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Decentralized Voting System',
    description: 'A decentralized voting system built with Next.js and Algorand',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-inter antialiased`}>
                <ErrorBoundary>
                    <UserProvider>
                        {/* <BlockchainProvider>{children}</BlockchainProvider> */}
                        {children}
                    </UserProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
