import { useState } from 'react';
import Button from '../../../components/common/Button';
import { MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PhysicalThreatDetector = () => {
  const [scanning, setScanning] = useState(false);
  const [threats, setThreats] = useState([]);

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setThreats([
        { id: 1, type: 'Suspicious vehicle', location: 'Main Street', distance: '200m' },
        { id: 2, type: 'Dark spot', location: 'Park Avenue', distance: '500m' }
      ]);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <Button variant="warning" className="w-full" onClick={scan} loading={scanning}><MapPinIcon className="w-5 h-5 mr-2" /> Scan Physical Threats</Button>
      {threats.map(t => (
        <div key={t.id} className="flex items-center gap-3 p-3 bg-danger/10 rounded-lg"><ExclamationTriangleIcon className="w-5 h-5 text-danger" /><div><p className="font-medium text-sm">{t.type}</p><p className="text-xs text-gray-600">{t.location} • {t.distance}</p></div></div>
      ))}
    </div>
  );
};

export default PhysicalThreatDetector;
