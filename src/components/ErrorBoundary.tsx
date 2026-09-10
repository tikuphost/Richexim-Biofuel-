import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Richmount Exim Portal] Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear app state cache in localStorage
      localStorage.removeItem('rme_rfq_items');
      localStorage.removeItem('rme_user_profile');
      localStorage.removeItem('rme_customer_chat_session');
      localStorage.removeItem('rme_seo_metadata');
      localStorage.removeItem('rme_products');
    } catch (e) {
      console.error(e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#172e18] text-[#edf3ea] flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-[#1e3c20] border border-[#2a4d2c] rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-[#e05252]/20 border border-[#e05252]/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#ff8080]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white mb-2">
              Application Notice
            </h1>
            <p className="text-sm text-[#a6caa8] mb-6 leading-relaxed">
              The portal encountered an unexpected runtime condition. You can reload the page or reset the cached state to restore normal operation.
            </p>

            {this.state.error && (
              <div className="bg-[#122413] border border-[#2a4d2c] rounded-xl p-3.5 mb-6 text-left overflow-x-auto text-xs font-mono text-[#f5b342]">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2a6a35] hover:bg-[#348342] text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#203a22] hover:bg-[#28492b] border border-[#2a4d2c] text-[#d0e5cf] font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Local Cache &amp; Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
