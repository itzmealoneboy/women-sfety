import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const icons = { success: CheckCircleIcon, error: XCircleIcon, info: InformationCircleIcon, warning: ExclamationTriangleIcon };
const colors = { success: 'text-green-500', error: 'text-red-500', info: 'text-blue-500', warning: 'text-yellow-500' };

const Notification = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = icons[type] || icons.info;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white rounded-lg shadow-lg p-4 animate-slide-in max-w-sm">
      <Icon className={`w-5 h-5 ${colors[type] || colors.info}`} />
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  );
};

export default Notification;
