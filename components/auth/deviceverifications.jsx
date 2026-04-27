import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { DevicePhoneMobileIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { generateDeviceFingerprint, getDeviceInfo } from '../../utils/deviceFingerprint';

const DeviceVerification = ({ onVerified, onCancel }) => {
  const [step, setStep] = useState('checking'); // checking, new, verified, blocked
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [trustedDevices, setTrustedDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDevice();
  }, []);

  const checkDevice = async () => {
    setLoading(true);
    
    // Get device fingerprint
    const fingerprint = await generateDeviceFingerprint();
    const info = getDeviceInfo();
    setDeviceInfo({ ...info, fingerprint });

    // Check if device is trusted (mock)
    const trusted = localStorage.getItem('trustedDevices');
    const trustedList = trusted ? JSON.parse(trusted) : [];
    setTrustedDevices(trustedList);

    const isTrusted = trustedList.some(d => d.fingerprint === fingerprint);
    
    if (isTrusted) {
      setStep('verified');
      setTimeout(() => onVerified(), 1500);
    } else {
      setStep('new');
    }

    setLoading(false);
  };

  const verifyDevice = () => {
    // Save device as trusted
    const trusted = [...trustedDevices, {
      ...deviceInfo,
      addedAt: new Date().toISOString()
    }];
    localStorage.setItem('trustedDevices', JSON.stringify(trusted));
    
    setStep('verified');
    setTimeout(() => onVerified(), 1500);
  };

  const blockDevice = () => {
    setStep('blocked');
  };

  if (loading) {
    return (
      <Card className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your device...</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          {step === 'verified' ? (
            <ShieldCheckIcon className="w-8 h-8 text-success" />
          ) : step === 'blocked' ? (
            <ExclamationTriangleIcon className="w-8 h-8 text-danger" />
          ) : (
            <DevicePhoneMobileIcon className="w-8 h-8 text-primary-600" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {step === 'verified' ? 'Device Verified' :
           step === 'blocked' ? 'Device Blocked' :
           step === 'new' ? 'New Device Detected' :
           'Checking Device...'}
        </h3>
      </div>

      {step === 'new' && deviceInfo && (
        <div className="space-y-4">
          <div className="bg-warning/10 p-4 rounded-lg">
            <p className="text-sm text-warning flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                We detected a login from a new device. Please verify it's you.
              </span>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm"><span className="font-medium">Device:</span> {deviceInfo.userAgent}</p>
            <p className="text-sm"><span className="font-medium">Platform:</span> {deviceInfo.platform}</p>
            <p className="text-sm"><span className="font-medium">Screen:</span> {deviceInfo.screenSize}</p>
            <p className="text-sm"><span className="font-medium">Timezone:</span> {deviceInfo.timezone}</p>
          </div>

          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-sm text-primary-700">
              To verify this device, we'll send a notification to your registered email and mobile.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={blockDevice}>
              Block Device
            </Button>
            <Button variant="primary" className="flex-1" onClick={verifyDevice}>
              Trust Device
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={onCancel}>
            Cancel Login
          </Button>
        </div>
      )}

      {step === 'verified' && (
        <div className="text-center py-4">
          <ShieldCheckIcon className="w-16 h-16 text-success mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Device verified successfully! Redirecting...
          </p>
        </div>
      )}

      {step === 'blocked' && (
        <div className="text-center py-4">
          <ExclamationTriangleIcon className="w-16 h-16 text-danger mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Device Blocked</h4>
          <p className="text-gray-600 mb-4">
            This device has been blocked. You will receive an email about this activity.
          </p>
          <Button variant="primary" className="w-full" onClick={onCancel}>
            Back to Login
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DeviceVerification;
