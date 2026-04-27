import { useState, useEffect } from 'react';
import { ChartBarIcon, UserGroupIcon, UsersIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const UserAnalytics = () => {
  const [stats, setStats] = useState({
    total: 1250,
    active: 342,
    new: 28,
    growth: 12
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-primary-50 rounded-lg text-center"><UserGroupIcon className="w-6 h-6 mx-auto text-primary-500 mb-1" /><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs">Total Users</p></div>
        <div className="p-4 bg-success/10 rounded-lg text-center"><UsersIcon className="w-6 h-6 mx-auto text-success mb-1" /><p className="text-2xl font-bold">{stats.active}</p><p className="text-xs">Active Now</p></div>
        <div className="p-4 bg-warning/10 rounded-lg text-center"><UserPlusIcon className="w-6 h-6 mx-auto text-warning mb-1" /><p className="text-2xl font-bold">{stats.new}</p><p className="text-xs">New Today</p></div>
        <div className="p-4 bg-info/10 rounded-lg text-center"><ChartBarIcon className="w-6 h-6 mx-auto text-primary-500 mb-1" /><p className="text-2xl font-bold">+{stats.growth}%</p><p className="text-xs">Growth</p></div>
      </div>
    </div>
  );
};

export default UserAnalytics;
