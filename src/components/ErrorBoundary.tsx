import { Component, ReactNode, ErrorInfo } from 'react'
import { logError } from '../utils/logger'

/**
 * ErrorBoundary component props
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ErrorBoundary component state
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary component to catch React errors gracefully
 * 
 * Purpose: Prevents entire application from crashing when a component error occurs
 * Displays user-friendly error message instead of blank screen
 * Logs errors for debugging in development
 * 
 * Usage:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * 
 * Or with custom fallback:
 * <ErrorBoundary fallback={<CustomErrorView />}>
 *   <Component />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(iProps: ErrorBoundaryProps) {
    super(iProps)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  /**
   * Updates state when an error is caught
   * 
   * Purpose: Trigger error UI display
   * 
   * @param {Error} iError - The error that was thrown
   * @returns {ErrorBoundaryState} Updated state
   */
  static getDerivedStateFromError(iError: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: iError,
      errorInfo: null
    }
  }

  /**
   * Logs error details when component catches an error
   * 
   * Purpose: Capture error information for debugging and monitoring
   * 
   * @param {Error} iError - The error that was thrown
   * @param {ErrorInfo} iErrorInfo - React error info with component stack
   * @returns {void}
   */
  componentDidCatch(iError: Error, iErrorInfo: ErrorInfo): void {
    logError('React component error caught by ErrorBoundary', {
      error: iError.message,
      stack: iError.stack,
      componentStack: iErrorInfo.componentStack
    })

    this.setState({
      errorInfo: iErrorInfo
    })

    // TODO: Send error to monitoring service (Sentry, LogRocket, etc.)
  }

  /**
   * Resets error boundary state
   * 
   * Purpose: Allow user to retry after error
   * 
   * @returns {void}
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f3f4f6',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              🌊
            </div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px'
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#6b7280',
                marginBottom: '24px'
              }}
            >
              We're having trouble loading tide data. This could be a temporary issue.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#991b1b'
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                  Error Details (Development)
                </summary>
                <pre style={{ overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
