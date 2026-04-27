import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Send to error reporting service if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // You can also send to an external error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;
    const { 
      fallback, 
      children, 
      showResetButton = true,
      resetButtonText = 'Try Again',
      errorTitle = 'Something went wrong',
      errorMessage = 'An unexpected error occurred. Please try again.',
      showDetailsButton = true
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback({ error, errorInfo, reset: this.handleReset })
          : fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <h2 className="error-title">{errorTitle}</h2>
            <p className="error-message">{errorMessage}</p>
            
            {showDetailsButton && (
              <button onClick={this.toggleDetails} className="details-button">
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            )}
            
            {showDetails && error && (
              <div className="error-details">
                <div className="error-details-section">
                  <h4>Error:</h4>
                  <pre>{error.toString()}</pre>
                </div>
                {errorInfo && (
                  <div className="error-details-section">
                    <h4>Component Stack:</h4>
                    <pre>{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            )}
            
            {showResetButton && (
              <button onClick={this.handleReset} className="reset-button">
                {resetButtonText}
              </button>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            }

            .error-container {
              background: white;
              border-radius: 16px;
              padding: 40px;
              max-width: 500px;
              width: 100%;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              animation: slideUp 0.3s ease;
            }

            .error-icon {
              margin-bottom: 20px;
            }

            .error-icon svg {
              width: 80px;
              height: 80px;
              color: #f56565;
              animation: shake 0.5s ease;
            }

            .error-title {
              margin: 0 0 10px 0;
              color: #2d3748;
              font-size: 24px;
              font-weight: 600;
            }

            .error-message {
              color: #718096;
              margin: 0 0 20px 0;
              font-size: 16px;
            }

            .details-button {
              background: none;
              border: none;
              color: #4299e1;
              cursor: pointer;
              font-size: 14px;
              margin-bottom: 20px;
              padding: 5px 10px;
              transition: color 0.2s;
            }

            .details-button:hover {
              color: #2b6cb0;
              text-decoration: underline;
            }

            .error-details {
              background: #f7fafc;
              border-radius: 8px;
              margin: 20px 0;
              text-align: left;
              overflow-x: auto;
            }

            .error-details-section {
              padding: 15px;
              border-bottom: 1px solid #e2e8f0;
            }

            .error-details-section:last-child {
              border-bottom: none;
            }

            .error-details-section h4 {
              margin: 0 0 10px 0;
              color: #2d3748;
              font-size: 14px;
              font-weight: 600;
            }

            .error-details-section pre {
              margin: 0;
              padding: 10px;
              background: #edf2f7;
              border-radius: 4px;
              font-size: 12px;
              overflow-x: auto;
              color: #c53030;
              font-family: 'Courier New', monospace;
            }

            .reset-button {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: transform 0.2s, box-shadow 0.2s;
            }

            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .reset-button:active {
              transform: translateY(0);
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes shake {
              0%, 100% {
                transform: translateX(0);
              }
              25% {
                transform: translateX(-5px);
              }
              75% {
                transform: translateX(5px);
              }
            }
          `}</style>
        </div>
      );
    }

    return children;
  }
}

// HOC to wrap components with ErrorBoundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
