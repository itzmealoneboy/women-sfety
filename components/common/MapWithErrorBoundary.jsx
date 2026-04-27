import React from 'react';
import Map from './Map';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: this.props.height || '400px',
          background: '#f8f9fa',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <i className="fas fa-map-marked-alt" style={{ fontSize: '48px', color: '#667eea' }}></i>
          <p>Map is loading. Please check your internet connection.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return <Map {...this.props} />;
  }
}

export default ErrorBoundary;