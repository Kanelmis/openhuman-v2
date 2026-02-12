'use client';

import React from 'react';
import { Button, Card } from '@/components/ui';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Card className="max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-surface-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
              Try Again
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Next.js App Router error boundary (app/error.tsx pattern)
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-surface-400 mb-4">{error.message}</p>
        <Button onClick={reset}>Try Again</Button>
      </Card>
    </div>
  );
}
