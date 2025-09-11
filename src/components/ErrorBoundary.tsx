import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 flex items-center justify-center text-white">
          <div className="max-w-2xl mx-auto p-8 bg-red-900/30 rounded-xl border border-red-400/30">
            <h2 className="text-2xl font-bold mb-4 text-red-300">出现错误</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">错误信息:</h3>
              <p className="text-red-200 bg-red-900/50 p-3 rounded">
                {this.state.error?.message || '未知错误'}
              </p>
            </div>
            
            {this.state.error?.stack && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">错误堆栈:</h3>
                <pre className="text-xs text-red-200 bg-red-900/50 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
            
            {this.state.errorInfo?.componentStack && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">组件堆栈:</h3>
                <pre className="text-xs text-red-200 bg-red-900/50 p-3 rounded overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-300"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;