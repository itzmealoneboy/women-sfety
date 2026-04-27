import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { UserGroupIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const FriendWalk = () => {
  const [active, setActive] = useState(false);
  const [friend, setFriend] = useState(null);
  const [duration, setDuration] = useState(0);
  const [friends] = useState([
    { id: 1, name: 'Mother', phone: '9876543210', online: true },
    { id: 2, name: 'Sister', phone: '9876543211', online: false },
    { id: 3, name: 'Friend Priya', phone: '9876543212', online: true },
  ]);

  useEffect(() => {
    let interval;
    if (active) interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [active]);

  const startWalk = (selectedFriend) => {
    setFriend(selectedFriend);
    setActive(true);
    setDuration(0);
  };

  const endWalk = () => {
    setActive(false);
    setFriend(null);
    setDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {!active ? (
        <>
          <p className="text-sm text-gray-600 mb-2">Select a friend to virtually escort you</p>
          {friends.map(f => (
            <button key={f.id} onClick={() => startWalk(f)} disabled={!f.online} className={`w-full p-3 rounded-lg flex items-center justify-between ${f.online ? 'bg-primary-50 hover:bg-primary-100' : 'bg-gray-50 opacity-50'}`}>
              <div className="flex items-center gap-3"><UserGroupIcon className="w-5 h-5 text-primary-500" /><div><p className="font-medium">{f.name}</p><p className="text-xs text-gray-500">{f.phone}</p></div></div>
              {f.online ? <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">Online</span> : <span className="text-xs text-gray-400">Offline</span>}
            </button>
          ))}
        </>
      ) : (
        <div className="p-4 bg-primary-50 rounded-lg text-center">
          <MapPinIcon className="w-12 h-12 text-primary-500 mx-auto mb-2 animate-pulse" />
          <p className="font-bold">{friend?.name} is virtually escorting you</p>
          <div className="flex items-center justify-center gap-2 mt-2"><ClockIcon className="w-4 h-4 text-gray-500" /><span className="text-2xl font-mono">{formatTime(duration)}</span></div>
          <Button variant="danger" className="w-full mt-3" onClick={endWalk}>End Walk</Button>
        </div>
      )}
    </div>
  );
};

export default FriendWalk;
