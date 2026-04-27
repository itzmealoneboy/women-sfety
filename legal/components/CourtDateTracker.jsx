import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { CalendarIcon, BellIcon, TrashIcon } from '@heroicons/react/24/outline';

const CourtDateTracker = () => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState({ caseName: '', date: '', court: '' });

  useEffect(() => {
    const saved = localStorage.getItem('courtDates');
    if (saved) setDates(JSON.parse(saved));
  }, []);

  const addDate = () => {
    if (!newDate.caseName || !newDate.date) return;
    const updated = [...dates, { ...newDate, id: Date.now(), reminder: true }];
    setDates(updated);
    localStorage.setItem('courtDates', JSON.stringify(updated));
    setNewDate({ caseName: '', date: '', court: '' });
  };

  const deleteDate = (id) => {
    const updated = dates.filter(d => d.id !== id);
    setDates(updated);
    localStorage.setItem('courtDates', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2"><Input placeholder="Case Name" value={newDate.caseName} onChange={(e) => setNewDate({ ...newDate, caseName: e.target.value })} /><Input type="date" value={newDate.date} onChange={(e) => setNewDate({ ...newDate, date: e.target.value })} /></div>
      <Input placeholder="Court Name" value={newDate.court} onChange={(e) => setNewDate({ ...newDate, court: e.target.value })} />
      <Button variant="primary" className="w-full" onClick={addDate}><CalendarIcon className="w-5 h-5 mr-2" /> Add Court Date</Button>
      {dates.map(date => (
        <div key={date.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">{date.caseName}</p><p className="text-xs text-gray-500">{new Date(date.date).toLocaleDateString()} • {date.court}</p></div>
          <button onClick={() => deleteDate(date.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button>
        </div>
      ))}
    </div>
  );
};

export default CourtDateTracker;
