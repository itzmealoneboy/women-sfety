import { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { CalendarIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

const ScheduledCalls = () => {
  const [calls, setCalls] = useState([]);
  const [newCall, setNewCall] = useState({ name: '', phone: '', time: '08:00', message: '' });

  const addCall = () => {
    if (newCall.name && newCall.phone && newCall.message) {
      setCalls([...calls, { ...newCall, id: Date.now() }]);
      setNewCall({ name: '', phone: '', time: '08:00', message: '' });
    }
  };

  const removeCall = (id) => setCalls(calls.filter(c => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3"><Input placeholder="Name" value={newCall.name} onChange={(e) => setNewCall({ ...newCall, name: e.target.value })} /><Input placeholder="Phone" value={newCall.phone} onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3"><Input type="time" value={newCall.time} onChange={(e) => setNewCall({ ...newCall, time: e.target.value })} icon={<ClockIcon className="w-5 h-5" />} /><Input placeholder="Message" value={newCall.message} onChange={(e) => setNewCall({ ...newCall, message: e.target.value })} /></div>
      <Button variant="primary" className="w-full" onClick={addCall}><CalendarIcon className="w-5 h-5 mr-2" /> Schedule Call</Button>
      {calls.map(call => (
        <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium">{call.name}</p><p className="text-xs text-gray-500">{call.phone} at {call.time}</p></div><button onClick={() => removeCall(call.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button></div>
      ))}
    </div>
  );
};

export default ScheduledCalls;
