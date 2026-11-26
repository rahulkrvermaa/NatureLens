import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('NatureLens render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-nature-dark text-nature-parchment flex flex-col items-center justify-center px-6 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-nature-surface border border-nature-border flex items-center justify-center text-nature-accent">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold">
              Something went wrong
            </h1>
            <p className="text-sm text-nature-textMuted">
              An unexpected error interrupted this view. Reloading the page usually resolves it.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-nature-accent text-white text-sm font-semibold hover:bg-nature-accentHover transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Page
            </button>
            <a
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-nature-surface border border-nature-border text-sm font-medium text-nature-parchment hover:border-nature-accent transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
