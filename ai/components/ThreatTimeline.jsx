import { useState } from 'react';
import { ClockIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ThreatTimeline = () => {
  const [events] = useState([
    { id: 1, type: 'safe', message: 'No threats detected', time: '10:30 AM' },
    { id: 2, type: 'warning', message: 'Unusual login attempt detected', time: '9:15 AM' },
    { id: 3, type: 'safe', message: 'Location normal', time: '8:00 AM' },
  ]);

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div key={event.id} className={`flex items-start gap-3 p-3 rounded-lg ${event.type === 'warning' ? 'bg-danger/10 border-l-4 border-danger' : 'bg-success/10 border-l-4 border-success'}`}>
          {event.type === 'warning' ? <ExclamationTriangleIcon className="w-5 h-5 text-danger" /> : <ShieldCheckIcon className="w-5 h-5 text-success" />}
          <div className="flex-1"><p className="text-sm">{event.message}</p><div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><ClockIcon className="w-3 h-3" />{event.time}</div></div>
        </div>
      ))}
    </div>
  );
};

export default ThreatTimeline;
