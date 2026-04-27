import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Cog6ToothIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const FeatureFlags = () => {
  const [features, setFeatures] = useState([
    { id: 'ai_threat', name: 'AI Threat Detection', enabled: true },
    { id: 'voice_clone', name: 'Voice Clone System', enabled: true },
    { id: 'fake_call', name: 'Fake Call Generator', enabled: true },
    { id: 'face_recognition', name: 'Face Recognition', enabled: false },
    { id: 'crime_prediction', name: 'Crime Prediction', enabled: false },
  ]);

  const toggleFeature = (id) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const saveSettings = () => {
    localStorage.setItem('featureFlags', JSON.stringify(features));
    alert('Feature flags saved. Refresh to apply changes.');
  };

  return (
    <div className="space-y-4">
      {features.map(feature => (
        <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div><p className="font-medium">{feature.name}</p><p className="text-xs text-gray-500">{feature.enabled ? 'Active' : 'Disabled'}</p></div>
          <button onClick={() => toggleFeature(feature.id)} className={`relative w-12 h-6 rounded-full transition ${feature.enabled ? 'bg-primary-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${feature.enabled ? 'right-1' : 'left-1'}`} /></button>
        </div>
      ))}
      <Button variant="primary" className="w-full" onClick={saveSettings}><Cog6ToothIcon className="w-5 h-5 mr-2" /> Save Settings</Button>
    </div>
  );
};

export default FeatureFlags;
