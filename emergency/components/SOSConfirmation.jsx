import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SOSConfirmation = ({ onConfirm, onCancel }) => {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    if (timer === 0) onConfirm();
    return () => clearInterval(interval);
  }, [timer, onConfirm]);

  return (
    <div className="text-center space-y-4">
      <div className="w-24 h-24 bg-danger rounded-full mx-auto flex items-center justify-center animate-pulse">
        <ExclamationTriangleIcon className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">SOS will be sent in {timer} seconds</h3>
      <div className="flex gap-3">
        <Button variant="success" className="flex-1" onClick={onCancel}><CheckCircleIcon className="w-5 h-5 mr-2" /> I'M SAFE</Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm}>SEND NOW</Button>
      </div>
    </div>
  );
};

export default SOSConfirmation;
