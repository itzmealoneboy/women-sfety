import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { PlayIcon, StopIcon, ClockIcon } from '@heroicons/react/24/outline';

const RoutePlayback = ({ route }) => {
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval;
    if (playing && route) {
      interval = setInterval(() => {
        setIndex(i => i < route.length - 1 ? i + 1 : (setPlaying(false), i));
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [playing, route, speed]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => setPlaying(true)} disabled={playing}><PlayIcon className="w-4 h-4" /></Button>
          <Button variant="danger" size="sm" onClick={() => setPlaying(false)} disabled={!playing}><StopIcon className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-gray-500" /><span className="text-sm">{index}/{route?.length}</span><select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="p-1 border rounded text-sm"><option value="0.5">0.5x</option><option value="1">1x</option><option value="2">2x</option></select></div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary-500 transition-all" style={{ width: `${(index / (route?.length || 1)) * 100}%` }} /></div>
    </div>
  );
};

export default RoutePlayback;
