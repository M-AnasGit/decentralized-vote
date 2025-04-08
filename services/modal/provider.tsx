'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import React from 'react';

type ModalProviderProps = React.PropsWithChildren<{}>;

type ModalContextType = {
    modal: React.ReactNode | null;
    handleSetModal: (modal: React.ReactNode, width?: number) => void;
    handleRemoveModal: () => void;
};

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: ModalProviderProps) => {
    const [modal, setModal] = React.useState<React.ReactNode>(null);
    const [width, setWidth] = React.useState<number | null>(null);
    const handleSetModal = React.useCallback((modal: React.ReactNode, width?: number) => {
        setModal(modal);
        if (width) {
            setWidth(width);
        } else {
            setWidth(null);
        }
    }, []);

    const handleRemoveModal = React.useCallback(() => {
        setModal(null);
    }, []);

    return (
        <ModalContext.Provider value={{ modal, handleSetModal, handleRemoveModal }}>
            {children}
            <Dialog open={!!modal} onOpenChange={handleRemoveModal}>
                <DialogContent
                    data-testid="modal-dialog"
                    style={{
                        maxWidth: width ? '90%' : '32rem',
                        ...(width ? { width: `${width}px` } : {}),
                    }}
                >
                    {modal}
                </DialogContent>
            </Dialog>
        </ModalContext.Provider>
    );
};

export default ModalProvider;

export const useModal = () => {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
