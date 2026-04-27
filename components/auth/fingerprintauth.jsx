import React, { useState, useEffect } from 'react';

const FingerprintAuth = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricStatus();
  }, []);

  const checkBiometricSupport = () => {
    // Check if WebAuthn is supported
    if (window.PublicKeyCredential && 
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => {
          setIsSupported(available);
          if (!available) {
            setStatus('Biometric authentication is not available on this device');
          }
        })
        .catch(() => {
          setIsSupported(false);
          setStatus('Biometric authentication is not supported');
        });
    } else {
      setIsSupported(false);
      setStatus('WebAuthn is not supported in this browser');
    }
  };

  const checkBiometricStatus = async () => {
    try {
      // Check if user has biometric enabled in your backend
      const hasBiometric = localStorage.getItem('biometric_enabled') === 'true';
      setIsEnabled(hasBiometric);
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  const registerBiometric = async () => {
    if (!isSupported) {
      setStatus('Biometric authentication is not supported on this device');
      return;
    }

    try {
      // Create credentials for WebAuthn registration
      const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "Your App Name",
          id: window.location.hostname
        },
        user: {
          id: new Uint8Array(16),
          name: "user@example.com",
          displayName: "User Name"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      };

      // In a real app, you would get these options from your backend
      // const options = await fetch('/api/biometric/register/begin').then(r => r.json());
      
      // Simulate registration
      setStatus('Please authenticate with your fingerprint...');
      setIsAuthenticating(true);
      
      // Simulate biometric prompt
      setTimeout(() => {
        setIsEnabled(true);
        setIsAuthenticating(false);
        localStorage.setItem('biometric_enabled', 'true');
        setStatus('Biometric authentication enabled successfully!');
        setTimeout(() => setStatus(''), 3000);
      }, 2000);

    } catch (error) {
      console.error('Error registering biometric:', error);
      setStatus('Failed to enable biometric authentication');
      setIsAuthenticating(false);
    }
  };

  const authenticateWithBiometric = async () => {
    if (!isEnabled) return;

    try {
      // Get assertion for WebAuthn authentication
      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        timeout: 60000,
        userVerification: "required",
        rpId: window.location.hostname
      };

      // In a real app, you would get these options from your backend
      // const options = await fetch('/api/biometric/authenticate/begin').then(r => r.json());
      
      setStatus('Please authenticate with your fingerprint...');
      setIsAuthenticating(true);
      
      // Simulate biometric authentication
      setTimeout(() => {
        setIsAuthenticating(false);
        setStatus('Authentication successful!');
        setTimeout(() => setStatus(''), 2000);
        // Trigger login success or redirect
      }, 2000);

    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      setStatus('Authentication failed');
      setIsAuthenticating(false);
    }
  };

  const disableBiometric = async () => {
    try {
      // Call your backend to disable biometric
      // await fetch('/api/biometric/disable', { method: 'POST' });
      
      setIsEnabled(false);
      localStorage.setItem('biometric_enabled', 'false');
      setStatus('Biometric authentication disabled');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error disabling biometric:', error);
      setStatus('Failed to disable biometric authentication');
    }
  };

  return (
    <div className="fingerprint-auth">
      <div className="auth-header">
        <h2>Biometric Authentication</h2>
        <p>Use your fingerprint or face ID for quick and secure login</p>
      </div>

      <div className="auth-status">
        <div className="status-indicator">
          <span className={`status-dot ${isSupported ? 'supported' : 'unsupported'}`}></span>
          <span className="status-text">
            {isSupported ? 'Biometric authentication available' : 'Biometric authentication not available'}
          </span>
        </div>
      </div>

      {isSupported && (
        <div className="auth-controls">
          {!isEnabled ? (
            <button 
              onClick={registerBiometric}
              disabled={isAuthenticating}
              className="btn-enable"
            >
              <span className="icon">🔒</span>
              {isAuthenticating ? 'Authenticating...' : 'Enable Biometric Login'}
            </button>
          ) : (
            <>
              <button 
                onClick={authenticateWithBiometric}
                disabled={isAuthenticating}
                className="btn-authenticate"
              >
                <span className="icon">👆</span>
                {isAuthenticating ? 'Authenticating...' : 'Authenticate with Biometric'}
              </button>
              <button 
                onClick={disableBiometric}
                className="btn-disable"
              >
                Disable Biometric
              </button>
            </>
          )}
        </div>
      )}

      {status && (
        <div className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>
          {status}
        </div>
      )}

      <div className="info-box">
        <h4>How it works:</h4>
        <ul>
          <li>Your biometric data never leaves your device</li>
          <li>Uses secure hardware-backed authentication</li>
          <li>Works with fingerprint, face ID, or other biometric sensors</li>
          <li>Provides a convenient and secure way to access your account</li>
        </ul>
      </div>

      <style jsx>{`
        .fingerprint-auth {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .auth-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .auth-header h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .auth-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .auth-status {
          margin-bottom: 20px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-dot.supported {
          background-color: #28a745;
        }

        .status-dot.unsupported {
          background-color: #dc3545;
        }

        .status-text {
          color: #666;
          font-size: 14px;
        }

        .auth-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .btn-enable, .btn-authenticate, .btn-disable {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-enable {
          background: #007bff;
          color: white;
        }

        .btn-enable:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-authenticate {
          background: #28a745;
          color: white;
        }

        .btn-authenticate:hover:not(:disabled) {
          background: #218838;
        }

        .btn-disable {
          background: #dc3545;
          color: white;
        }

        .btn-disable:hover {
          background: #c82333;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .icon {
          margin-right: 8px;
        }

        .status-message {
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }

        .status-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .info-box {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          padding: 15px;
          border-radius: 4px;
        }

        .info-box h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .info-box ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-box li {
          color: #666;
          margin-bottom: 5px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default FingerprintAuth;
