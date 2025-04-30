'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import Cookies from 'js-cookie';

declare global {
    interface Window {
        ethereum: any;
    }
}

type User = {
    name: string;
    address: string;
    chainId?: number;
};

type UserContextType = {
    user?: User;
    provider?: ethers.providers.Web3Provider;
    signer?: ethers.Signer;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnecting: boolean;
    error?: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOONBASE_ALPHA_CONFIG = {
    chainId: '0x507',
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
        name: 'DEV',
        symbol: 'DEV',
        decimals: 18,
    },
    rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
    blockExplorerUrls: ['https://moonbase.moonscan.io/'],
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
    const [user, setUser] = useState<User | undefined>();
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();
    const [signer, setSigner] = useState<ethers.Signer | undefined>();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const modal = new Web3Modal({
                network: 'moonbasealpha',
                cacheProvider: true,
            });
            setWeb3Modal(modal);
        }
    }, []);

    useEffect(() => {
        const connectSavedWallet = async () => {
            if (web3Modal && web3Modal.cachedProvider) {
                try {
                    await connectWallet();
                } catch (error) {
                    console.error('Failed to reconnect wallet', error);
                }
            }
        };

        if (web3Modal) {
            connectSavedWallet();
        }
    }, [web3Modal]);

    const addMoonbaseAlphaNetwork = async () => {
        if (!window.ethereum) {
            throw new Error('No crypto wallet found. Please install MetaMask.');
        }

        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [MOONBASE_ALPHA_CONFIG],
            });
        } catch (error) {
            console.error('Failed to add Moonbase Alpha network:', error);
            throw error;
        }
    };

    const ensureCorrectNetwork = async (provider: any) => {
        const { chainId } = await provider.getNetwork();

        if (chainId !== 1287) {
            try {
                await provider.send('wallet_switchEthereumChain', [{ chainId: '0x507' }]);
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    await addMoonbaseAlphaNetwork();
                } else {
                    throw switchError;
                }
            }
        }
    };

    const connectWallet = async () => {
        if (!web3Modal) return;

        setIsConnecting(true);
        setError(undefined);

        try {
            const instance = await web3Modal.connect();

            const ethProvider = new ethers.providers.Web3Provider(instance);
            await ensureCorrectNetwork(ethProvider);

            const updatedProvider = new ethers.providers.Web3Provider(instance);
            setProvider(updatedProvider);

            const ethSigner = updatedProvider.getSigner();
            setSigner(ethSigner);

            const address = await ethSigner.getAddress();
            const network = await updatedProvider.getNetwork();

            setUser({
                name: 'User',
                address: address,
                chainId: network.chainId,
            });

            Cookies.set('walletAddress', address, { expires: 7 });
            instance.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    setUser((prev) => (prev ? { ...prev, address: accounts[0] } : undefined));
                    Cookies.set('walletAddress', accounts[0], { expires: 7 });
                }
            });

            instance.on('chainChanged', async () => {
                window.location.reload();
            });

            instance.on('disconnect', () => {
                disconnectWallet();
            });
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError('Failed to connect wallet. Please try again.');
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        if (web3Modal) {
            web3Modal.clearCachedProvider();
        }

        setUser(undefined);
        setProvider(undefined);
        setSigner(undefined);
        Cookies.remove('walletAddress');
    };

    return (
        <UserContext.Provider
            value={{
                user,
                provider,
                signer,
                connectWallet,
                disconnectWallet,
                isConnecting,
                error,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;

export const useUserData = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserProvider');
    }
    return context;
};
