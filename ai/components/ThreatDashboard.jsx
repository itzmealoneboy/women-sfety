import { useState, useEffect } from 'react';
import ThreatMeter from './ThreatMeter';
import { ShieldCheckIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const ThreatDashboard = () => {
  const [threatLevel, setThreatLevel] = useState(25);
  const [threats, setThreats] = useState({ cyber: 0, physical: 0, social: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLevel(prev => Math.min(100, prev + Math.floor(Math.random() * 5) - 2));
      setThreats({
        cyber: Math.floor(Math.random() * 3),
        physical: Math.floor(Math.random() * 2),
        social: Math.floor(Math.random() * 4)
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow text-center"><ShieldCheckIcon className="w-8 h-8 mx-auto text-primary-500 mb-2" /><p className="text-2xl font-bold">{threatLevel}%</p><p className="text-sm text-gray-600">Threat Level</p></div>
        <div className="bg-white p-6 rounded-xl shadow text-center"><ExclamationTriangleIcon className="w-8 h-8 mx-auto text-danger mb-2" /><p className="text-2xl font-bold">{threats.cyber + threats.physical + threats.social}</p><p className="text-sm text-gray-600">Active Threats</p></div>
        <div className="bg-white p-6 rounded-xl shadow text-center"><ChartBarIcon className="w-8 h-8 mx-auto text-success mb-2" /><p className="text-2xl font-bold">24/7</p><p className="text-sm text-gray-600">Monitoring</p></div>
      </div>
      <ThreatMeter level={threatLevel} />
    </div>
  );
};

export default ThreatDashboard;
