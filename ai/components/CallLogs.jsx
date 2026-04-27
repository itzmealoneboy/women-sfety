import { useState, useEffect } from 'react';
import { PhoneIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const CallLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('callLogs');
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  return (
    <div className="space-y-3">
      {logs.length === 0 ? <div className="text-center py-8 text-gray-500">No call logs</div> : logs.map((log, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <PhoneIcon className="w-5 h-5 text-primary-500" />
          <div className="flex-1"><p className="font-medium text-sm">{log.name}</p><p className="text-xs text-gray-500">{log.time} • {log.duration}</p></div>
          {log.status === 'completed' ? <CheckCircleIcon className="w-5 h-5 text-success" /> : <XCircleIcon className="w-5 h-5 text-danger" />}
        </div>
      ))}
    </div>
  );
};

export default CallLogs;
