import { useState, useEffect } from 'react';
import { ClockIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SOSHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sosHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="space-y-3">
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No SOS history</div>
      ) : (
        history.map((item, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-gray-500" /><span className="text-sm">{formatDate(item.timestamp)}</span></div>
              <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'resolved' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{item.status}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm"><MapPinIcon className="w-4 h-4 text-gray-500" />{item.location}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default SOSHistory;
