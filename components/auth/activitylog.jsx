import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivityLog();
  }, []);

  const fetchActivityLog = async () => {
    try {
      // Simulate API call
      const mockActivities = [
        {
          id: 1,
          type: 'login',
          description: 'Successful login',
          location: 'New York, USA',
          device: 'Chrome on Windows',
          ip: '192.168.1.1',
          timestamp: new Date(2024, 0, 15, 10, 30),
          status: 'success'
        },
        {
          id: 2,
          type: 'password_change',
          description: 'Password changed',
          location: 'New York, USA',
          device: 'Chrome on Windows',
          ip: '192.168.1.1',
          timestamp: new Date(2024, 0, 14, 15, 45),
          status: 'success'
        },
        {
          id: 3,
          type: 'login',
          description: 'Failed login attempt',
          location: 'Unknown',
          device: 'Firefox on Mac',
          ip: '203.0.113.5',
          timestamp: new Date(2024, 0, 13, 8, 15),
          status: 'failed'
        }
      ];
      setActivities(mockActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type, status) => {
    if (status === 'failed') return '🔴';
    switch (type) {
      case 'login': return '🔑';
      case 'logout': return '🚪';
      case 'password_change': return '🔒';
      case '2fa_enabled': return '📱';
      case '2fa_disabled': return '📱❌';
      case 'security_question': return '❓';
      default: return '📝';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h2>Activity Log</h2>
        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="password_change">Password Changes</option>
            <option value="2fa_enabled">2FA Changes</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading activities...</div>
      ) : (
        <div className="activities-list">
          {filteredActivities.map(activity => (
            <div key={activity.id} className={`activity-item ${activity.status}`}>
              <div className="activity-icon">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="activity-details">
                <div className="activity-description">
                  {activity.description}
                </div>
                <div className="activity-meta">
                  <span className="location">{activity.location}</span>
                  <span className="device">{activity.device}</span>
                  <span className="ip">{activity.ip}</span>
                </div>
                <div className="activity-time">
                  {format(activity.timestamp, 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .activity-log {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .activity-header h2 {
          margin: 0;
          color: #333;
        }

        .filter-controls select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .activities-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s;
        }

        .activity-item:hover {
          background-color: #f8f9fa;
        }

        .activity-item.failed {
          background-color: #fff3f3;
        }

        .activity-icon {
          font-size: 24px;
          margin-right: 15px;
        }

        .activity-details {
          flex: 1;
        }

        .activity-description {
          font-weight: 500;
          color: #333;
          margin-bottom: 5px;
        }

        .activity-meta {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .activity-time {
          font-size: 12px;
          color: #999;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ActivityLog;
