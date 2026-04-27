import { useState, useEffect } from 'react';
import { PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

const FakeCallHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fakeCallHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <div className="space-y-3">
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No fake calls yet</div>
      ) : (
        history.map((call, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <PhoneIcon className="w-5 h-5 text-primary-500" />
            <div><p className="font-medium text-sm">{call.caller}</p><p className="text-xs text-gray-600">"{call.message.substring(0, 50)}..."</p><div className="flex items-center gap-1 mt-1 text-xs text-gray-400"><ClockIcon className="w-3 h-3" />{call.time}</div></div>
          </div>
        ))
      )}
    </div>
  );
};

export default FakeCallHistory;
