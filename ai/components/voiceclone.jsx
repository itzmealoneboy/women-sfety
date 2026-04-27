import { useState } from 'react';
import Button from '../../../components/common/Button';
import { MicrophoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const VoiceClone = ({ onClone }) => {
  const [cloning, setCloning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cloned, setCloned] = useState(false);

  const startClone = () => {
    setCloning(true);
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); setCloning(false); setCloned(true); if (onClone) onClone(); return 100; } return p + 10; });
    }, 500);
  };

  return (
    <div className="space-y-4">
      {!cloned ? (
        <>
          <div className="bg-primary-50 p-4 rounded-lg text-center"><MicrophoneIcon className="w-12 h-12 text-primary-500 mx-auto mb-2" /><p className="text-sm text-primary-700">Record 5 minutes of your voice for cloning</p></div>
          <Button variant="primary" className="w-full" onClick={startClone} loading={cloning}>Clone My Voice</Button>
          {cloning && <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} /></div>}
        </>
      ) : (
        <div className="bg-success/10 p-4 rounded-lg text-center"><CheckCircleIcon className="w-12 h-12 text-success mx-auto mb-2" /><p className="text-success font-medium">Voice Cloned Successfully!</p><p className="text-xs text-gray-500">2 second delay only</p></div>
      )}
    </div>
  );
};

export default VoiceClone;
