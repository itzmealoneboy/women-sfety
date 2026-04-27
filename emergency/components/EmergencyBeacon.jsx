import { useState, useRef, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { LightBulbIcon, SpeakerWaveIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EmergencyBeacon = () => {
  const [active, setActive] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => setFlashing(f => !f), 500);
      return () => clearInterval(interval);
    }
  }, [active]);

  const activate = () => {
    setActive(true);
    document.body.style.backgroundColor = flashing ? '#ff4757' : '#ffffff';
    const audio = new Audio('/sounds/alert.mp3');
    audio.loop = true;
    audio.play();
    audioRef.current = audio;
  };

  const deactivate = () => {
    setActive(false);
    setFlashing(false);
    document.body.style.backgroundColor = '';
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return (
    <div className="space-y-4">
      {!active ? (
        <Button variant="danger" className="w-full" onClick={activate}><ExclamationTriangleIcon className="w-5 h-5 mr-2" /> Activate Emergency Beacon</Button>
      ) : (
        <>
          <div className={`p-4 text-center rounded-lg ${flashing ? 'bg-danger text-white' : 'bg-white text-danger border-2 border-danger'}`}>
            <LightBulbIcon className="w-12 h-12 mx-auto mb-2 animate-pulse" />
            <p className="font-bold">EMERGENCY BEACON ACTIVE</p>
            <p className="text-sm">Your location is being broadcasted</p>
          </div>
          <Button variant="outline" className="w-full" onClick={deactivate}>Deactivate Beacon</Button>
        </>
      )}
    </div>
  );
};

export default EmergencyBeacon;
