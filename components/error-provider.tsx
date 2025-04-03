'use client';
import React, { ReactNode } from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
                    <h2 className="text-3xl">Oops, there is an error!</h2>
                    <Button onClick={() => this.setState({ hasError: false })}>Try again?</Button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
