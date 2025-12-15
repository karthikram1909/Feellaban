import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
          <ErrorState 
            message={this.state.error?.message || 'An unexpected error occurred'} 
            onRetry={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }} 
          />
        </div>
      );
    }

    return this.props.children;
  }
}
