import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { BellIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const CheckInReminder = () => {
  const [enabled, setEnabled] = useState(false);
  const [interval, setIntervalTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);

  useEffect(() => {
    let timer;
    if (enabled && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (enabled && timeLeft === 0 && timeLeft !== null) {
      alert('Check-in overdue! Sending alert to emergency contacts.');
      setTimeLeft(interval * 60);
    }
    return () => clearInterval(timer);
  }, [enabled, timeLeft, interval]);

  const startReminders = () => {
    setEnabled(true);
    setTimeLeft(interval * 60);
    setLastCheckIn(new Date());
  };

  const checkIn = () => {
    setLastCheckIn(new Date());
    setTimeLeft(interval * 60);
  };

  const stopReminders = () => {
    setEnabled(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {!enabled ? (
        <>
          <div className="flex items-center justify-between"><span className="text-sm">Check-in interval (minutes)</span><select value={interval} onChange={(e) => setIntervalTime(parseInt(e.target.value))} className="p-2 border rounded"><option value="15">15</option><option value="30">30</option><option value="60">60</option></select></div>
          <Button variant="primary" className="w-full" onClick={startReminders}><BellIcon className="w-5 h-5 mr-2" /> Enable Check-in Reminders</Button>
        </>
      ) : (
        <div className="p-4 bg-primary-50 rounded-lg text-center">
          <ClockIcon className="w-12 h-12 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-mono">{formatTime(timeLeft)}</p>
          <p className="text-sm text-gray-600">until next check-in</p>
          <div className="flex gap-2 mt-3">
            <Button variant="success" className="flex-1" onClick={checkIn}><CheckCircleIcon className="w-4 h-4 mr-1" /> I'm Safe</Button>
            <Button variant="danger" className="flex-1" onClick={stopReminders}>Stop</Button>
          </div>
          {lastCheckIn && <p className="text-xs text-gray-500 mt-2">Last check-in: {lastCheckIn.toLocaleTimeString()}</p>}
        </div>
      )}
    </div>
  );
};

export default CheckInReminder;
