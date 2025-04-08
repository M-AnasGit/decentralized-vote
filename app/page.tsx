'use client';
import React from 'react';
import Image from 'next/image';

import ProcessBubble from './__components__/process-bubble';
import VoteModal from './__components__/vote-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Button } from '../components/ui/button';

import logo from '../assets/images/AlgoVote.svg';
import { ScrollText, SquareCheckBig, Vote, Wallet } from 'lucide-react';

import { useUserData } from '@/services/user/provider';
import { useModal } from '@/services/modal/provider';
import { useBlockchain } from '@/services/blockchain/provider';

const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function Home() {
    const { user, connectWallet, disconnectWallet } = useUserData();
    const { handleBlockchainVote } = useBlockchain();
    const { handleSetModal } = useModal();

    const handleVote = () => {
        handleSetModal(<VoteModal handleVote={handleBlockchainVote} />);
    };
    const handleResults = () => {};

    return (
        <div className="flex flex-col gap-4 py-16 px-32">
            <nav className="flex w-full justify-between ">
                <Image src={logo} alt="vote" width="100" height="100" className="w-auto" />
                {user ? (
                    <div className="flex gap-4 items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger tabIndex={-1}>
                                    <div className="text-sm font-semibold text-muted-foreground cursor-pointer">
                                        Connected <span className="bg-muted  px-4 py-2 rounded-md">{shortenAddress(user.address)}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>{user.address}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button size={'lg'} onClick={disconnectWallet}>
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <Button size={'lg'} onClick={connectWallet}>
                        Connect to wallet
                    </Button>
                )}
            </nav>
            <main className="my-16 space-y-4">
                <div className="w-full flex items-center justify-center">
                    <section className="flex flex-col gap-4 items-center justify-center">
                        <h1 className="text-7xl font-semibold text-primary text-center">
                            Decentralized <br></br>Voting
                        </h1>
                        <p className="text-lg font-medium text-muted-foreground">Vote for the right candidate!</p>
                        <div className="flex gap-4 my-4">
                            <Button variant="default" onClick={handleVote}>
                                Vote now
                            </Button>
                            <Button variant="secondary" onClick={handleResults}>
                                Result
                            </Button>
                        </div>
                    </section>
                </div>
                <h2 className="text-center text-3xl text-primary font-medium">How to vote</h2>
                <div className="px-8 pt-4 flex w-full justify-center gap-16">
                    <ProcessBubble Icon={Wallet} title="Connect your wallet" />
                    <ProcessBubble Icon={SquareCheckBig} title="Register your vote" />
                    <ProcessBubble Icon={Vote} title="Confirm and submit" />
                    <ProcessBubble Icon={ScrollText} title="Check the results" />
                </div>
            </main>
        </div>
    );
}
