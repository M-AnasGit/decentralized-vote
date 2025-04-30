'use client';
import React from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

import Cookies from 'js-cookie';

const peraWallet = new PeraWalletConnect();

type User = {
    name: string;
    address: string;
};

type UserContextType = {
    user?: User;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<User | undefined>();

    const connectWallet = async () => {
        try {
            const accounts = await peraWallet.connect();
            peraWallet.connector?.on('disconnect', disconnectWallet);

            if (accounts.length > 0) {
                setUser({ name: 'User', address: accounts[0] });
                Cookies.set('walletAddress', accounts[0], { expires: 7 });
            }
        } catch (error) {
            console.error('Failed to connect Pera Wallet', error);
        }
    };

    React.useEffect(() => {
        const savedAddress = Cookies.get('walletAddress');

        if (savedAddress) {
            peraWallet
                .reconnectSession()
                .then((accounts) => {
                    if (accounts.length > 0) {
                        setUser({ name: 'User', address: accounts[0] });
                        Cookies.set('walletAddress', accounts[0], { expires: 7 });
                    }
                })
                .catch(console.error);
        }

        return () => {
            peraWallet.connector?.off('disconnect');
        };
    }, []);

    const disconnectWallet = () => {
        peraWallet.disconnect();
        setUser(undefined);
        Cookies.remove('walletAddress');
    };

    return <UserContext.Provider value={{ user, connectWallet, disconnectWallet }}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUserData = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserProvider');
    }
    return context;
};
