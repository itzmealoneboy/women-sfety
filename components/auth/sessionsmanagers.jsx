import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authstores';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ClockIcon, DevicePhoneMobileIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const SessionManager = () => {
  const navigate = useNavigate();
  const { user, sessionId, logout, logoutAll } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    const checkSession = setInterval(() => {
      // Check session expiry (mock)
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      if (sessionExpiry) {
        const remaining = Math.floor((new Date(sessionExpiry) - new Date()) / 1000);
        if (remaining < 300 && remaining > 0) {
          setShowWarning(true);
          setTimeLeft(remaining);
        } else if (remaining <= 0) {
          handleSessionExpired();
        }
      }
    }, 1000);

    loadActiveSessions();

    return () => clearInterval(checkSession);
  }, []);

  const loadActiveSessions = () => {
    // Mock active sessions
    setActiveSessions([
      {
        id: 1,
        device: 'Chrome on Windows',
        location: 'Chennai, India',
        lastActive: 'Just now',
        current: true
      },
      {
        id: 2,
        device: 'Safari on iPhone',
        location: 'Mumbai, India',
        lastActive: '2 hours ago',
        current: false
      }
    ]);
  };

  const handleSessionExpired = () => {
    logout();
    navigate('/login?reason=session_expired');
  };

  const handleExtendSession = () => {
    // Extend session by 1 hour
    const newExpiry = new Date(Date.now() + 60 * 60 * 1000);
    localStorage.setItem('sessionExpiry', newExpiry.toISOString());
    setShowWarning(false);
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    navigate('/login');
  };

  const handleEndSession = (sessionId) => {
    setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
  };

  return (
    <>
      {/* Session Warning Modal */}
      <Modal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Session Expiring Soon"
      >
        <div className="text-center">
          <ClockIcon className="w-16 h-16 text-warning mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-800 mb-2">
            Your session will expire in {Math.floor(timeLeft / 60)}:{timeLeft % 60}
          </p>
          <p className="text-gray-600 mb-6">
            For your security, sessions expire after 1 hour of inactivity.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowWarning(false)}>
              Ignore
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleExtendSession}>
              Extend Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Active Sessions Panel */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DevicePhoneMobileIcon className="w-5 h-5 text-primary-500" />
          Active Sessions
        </h3>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                session.current ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  session.current ? 'bg-success' : 'bg-gray-400'
                }`} />
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {session.location} • 🕐 {session.lastActive}
                  </p>
                </div>
              </div>

              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEndSession(session.id)}
                >
                  End
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheckIcon className="w-4 h-4 text-success" />
            <span>All sessions are encrypted</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogoutAll}>
            Logout All Devices
          </Button>
        </div>
      </div>
    </>
  );
};

export default SessionManager;

