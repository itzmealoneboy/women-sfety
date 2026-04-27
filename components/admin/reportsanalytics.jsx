import { useState } from 'react';
import { ChartBarIcon, DocumentTextIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ReportAnalytics = () => {
  const [stats] = useState({
    total: 156,
    pending: 23,
    resolved: 98,
    inProgress: 35
  });

  const categories = [
    { name: 'Harassment', count: 45, color: 'bg-danger' },
    { name: 'Theft', count: 32, color: 'bg-warning' },
    { name: 'Cyber Crime', count: 28, color: 'bg-primary-500' },
    { name: 'Fraud', count: 21, color: 'bg-success' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center"><DocumentTextIcon className="w-5 h-5 mx-auto text-primary-500 mb-1" /><p className="text-xl font-bold">{stats.total}</p><p>Total</p></div>
        <div className="p-3 bg-warning/10 rounded-lg text-center"><ExclamationTriangleIcon className="w-5 h-5 mx-auto text-warning mb-1" /><p className="text-xl font-bold">{stats.pending}</p><p>Pending</p></div>
        <div className="p-3 bg-success/10 rounded-lg text-center"><CheckCircleIcon className="w-5 h-5 mx-auto text-success mb-1" /><p className="text-xl font-bold">{stats.resolved}</p><p>Resolved</p></div>
        <div className="p-3 bg-primary-50 rounded-lg text-center"><ChartBarIcon className="w-5 h-5 mx-auto text-primary-500 mb-1" /><p className="text-xl font-bold">{stats.inProgress}</p><p>In Progress</p></div>
      </div>
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.name}><div className="flex justify-between text-sm"><span>{cat.name}</span><span>{cat.count}</span></div><div className="h-2 bg-gray-200 rounded-full"><div className={`h-full ${cat.color} rounded-full`} style={{ width: `${(cat.count / stats.total) * 100}%` }} /></div></div>
        ))}
      </div>
    </div>
  );
};

export default ReportAnalytics;
