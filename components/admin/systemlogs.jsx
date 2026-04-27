import { useState, useEffect } from 'react';
import { ClockIcon, DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLogs([
      { id: 1, type: 'error', message: 'Firebase connection timeout', time: '2 min ago', user: 'System' },
      { id: 2, type: 'warning', message: 'High memory usage detected', time: '15 min ago', user: 'System' },
      { id: 3, type: 'info', message: 'User priya@email.com logged in', time: '1 hour ago', user: 'priya@email.com' },
    ]);
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="flex-1 p-2 border rounded"><option value="all">All Logs</option><option value="error">Errors</option><option value="warning">Warnings</option><option value="info">Info</option></select><Button variant="danger" size="sm" onClick={clearLogs}><TrashIcon className="w-4 h-4" /></Button></div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.map(log => (
          <div key={log.id} className={`p-3 rounded-lg ${log.type === 'error' ? 'bg-danger/10' : log.type === 'warning' ? 'bg-warning/10' : 'bg-gray-50'}`}>
            <div className="flex justify-between"><span className="text-sm font-medium">{log.message}</span><span className={`text-xs px-2 py-0.5 rounded-full ${log.type === 'error' ? 'bg-danger/20 text-danger' : log.type === 'warning' ? 'bg-warning/20 text-warning' : 'bg-gray-200'}`}>{log.type}</span></div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500"><ClockIcon className="w-3 h-3" />{log.time}<DocumentTextIcon className="w-3 h-3 ml-2" />{log.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemLogs;
