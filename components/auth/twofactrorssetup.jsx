import { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import QRCode from 'qrcode';
import { ShieldCheckIcon, KeyIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const TwoFactorSetup = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState('intro'); // intro, qr, verify, success
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const methods = [
    {
      id: 'app',
      name: 'Authenticator App',
      description: 'Use Google Authenticator or similar app',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 'sms',
      name: 'SMS',
      description: 'Receive codes via SMS',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Receive codes via email',
      icon: DevicePhoneMobileIcon
    }
  ];

  const generateQR = async () => {
    // Generate TOTP secret
    const newSecret = Math.random().toString(36).substring(2, 18);
    setSecret(newSecret);

    // Generate QR code
    const otpauth = `otpauth://totp/Sakhi:${localStorage.getItem('userEmail')}?secret=${newSecret}&issuer=Sakhi`;
    const qr = await QRCode.toDataURL(otpauth);
    setQrCode(qr);
    setStep('qr');
  };

  const verifyCode = () => {
    // Mock verification
    if (verificationCode === '123456') {
      setStep('success');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    } else {
      setError('Invalid verification code');
    }
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Two-Factor Authentication</h3>
        <p className="text-gray-600 text-sm mt-1">
          Add an extra layer of security to your account
        </p>
      </div>

      {step === 'intro' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Two-factor authentication adds an extra layer of security to your account by requiring
            a verification code in addition to your password.
          </p>

          <div className="space-y-3">
            {methods.map((method) => (
              <button
                key={method.id}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors text-left"
                onClick={generateQR}
              >
                <div className="flex items-start gap-3">
                  <method.icon className="w-5 h-5 text-primary-500 mt-1" />
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {onSkip && (
            <Button variant="ghost" className="w-full" onClick={onSkip}>
              Skip for now
            </Button>
          )}
        </div>
      )}

      {step === 'qr' && (
        <div className="space-y-4 text-center">
          <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-mono break-all">{secret}</p>
          </div>

          <p className="text-sm text-gray-600">
            Scan this QR code with your authenticator app, then enter the 6-digit code below.
          </p>

          <input
            type="text"
            maxLength="6"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-center text-2xl font-mono focus:border-primary-500 focus:outline-none"
          />

          {error && (
            <p className="text-danger text-sm">{error}</p>
          )}

          <Button
            variant="primary"
            className="w-full"
            onClick={verifyCode}
            disabled={verificationCode.length !== 6}
          >
            Verify & Enable 2FA
          </Button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-4">
          <ShieldCheckIcon className="w-16 h-16 text-success mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">2FA Enabled Successfully!</h4>
          <p className="text-gray-600">
            Your account is now more secure with two-factor authentication.
          </p>
        </div>
      )}
    </Card>
  );
};

export default TwoFactorSetup;
