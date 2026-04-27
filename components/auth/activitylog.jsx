import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { 
  ClockIcon, 
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    // Mock activity data
    const mockActivities = [
      {
        id: 1,
        type: 'login',
        status: 'success',
        device: 'Chrome on Windows',
        location: 'Chennai, India',
        ip: '192.168.1.100',
        time: '2 minutes ago',
        details: 'Login successful'
      },
      {
        id: 2,
        type: 'login',
        status: 'failed',
        device: 'Safari on iPhone',
        location: 'Mumbai, India',
        ip: '192.168.1.101',
        time: '1 hour ago',
        details: 'Invalid password'
      },
      {
        id: 3,
        type: 'settings',
        status: 'success',
        device: 'Firefox on Mac',
        location: 'Bangalore, India',
        ip: '192.168.1.102',
        time: '3 hours ago',
        details: 'Profile updated'
      },
      {
        id: 4,
        type: 'password',
        status: 'success',
        device: 'Chrome on Android',
        location: 'Delhi, India',
        ip: '192.168.1.103',
        time: '1 day ago',
        details: 'Password changed'
      },
      {
        id: 5,
        type: '2fa',
        status: 'success',
        device: 'Edge on Windows',
        location: 'Chennai, India',
        ip: '192.168.1.104',
        time: '2 days ago',
        details: '2FA enabled'
      }
    ];

    setActivities(mockActivities);
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? CheckCircleIcon : XCircleIcon;
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-success' : 'text-danger';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'login': return DevicePhoneMobileIcon;
      case 'settings': return ClockIcon;
      case 'password': return ShieldCheckIcon;
      case '2fa': return ShieldCheckIcon;
      default: return ClockIcon;
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-primary-500" />
        Recent Activity
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const StatusIcon = getStatusIcon(activity.status);
          const TypeIcon = getTypeIcon(activity.type);
          const statusColor = getStatusColor(activity.status);

          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'login' ? 'bg-primary-100' :
                activity.type === 'password' ? 'bg-warning/10' :
                'bg-success/10'
              }`}>
                <TypeIcon className={`w-4 h-4 ${
                  activity.type === 'login' ? 'text-primary-600' :
                  activity.type === 'password' ? 'text-warning' :
                  'text-success'
                }`} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{activity.details}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{activity.device}</span>
                      <span>•</span>
                      <GlobeAltIcon className="w-3 h-3" />
                      <span>{activity.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      IP: {activity.ip}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t">
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View all activity
        </button>
      </div>
    </Card>
  );
};

export default ActivityLog;
