import { useState } from 'react';
import Button from '../common/Button';
import { FingerPrintIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

const BiometricAuth = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleFingerprint = async () => {
    setLoading(true);
    try {
      if (!window.PublicKeyCredential) throw new Error('Not supported');
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000
        }
      });
      if (credential) onSuccess?.('fingerprint');
    } catch (error) {
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFace = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Face detection logic here
      stream.getTracks().forEach(t => t.stop());
      onSuccess?.('face');
    } catch (error) {
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button onClick={handleFingerprint} disabled={loading} className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition">
        <FingerPrintIcon className="w-8 h-8 text-primary-600" />
      </button>
      <button onClick={handleFace} disabled={loading} className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition">
        <FaceSmileIcon className="w-8 h-8 text-primary-600" />
      </button>
    </div>
  );
};

export default BiometricAuth;
