import { useState } from 'react';
import Button from '../../../components/common/Button';
import { ComputerDesktopIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CyberThreatScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      const threat = Math.random() > 0.7;
      setResult({ threat, message: threat ? 'Suspicious login detected from unknown device' : 'No threats detected' });
      setScanning(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <Button variant="primary" className="w-full" onClick={scan} loading={scanning}><ComputerDesktopIcon className="w-5 h-5 mr-2" /> Scan Cyber Threats</Button>
      {result && (
        <div className={`p-4 rounded-lg ${result.threat ? 'bg-danger/10 border border-danger' : 'bg-success/10 border border-success'}`}>
          <div className="flex items-start gap-3">
            {result.threat ? <ExclamationTriangleIcon className="w-5 h-5 text-danger" /> : <CheckCircleIcon className="w-5 h-5 text-success" />}
            <p className="text-sm">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberThreatScanner;
