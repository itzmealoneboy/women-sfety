import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { MapPinIcon, PlusIcon, TrashIcon, BellIcon } from '@heroicons/react/24/outline';

const Geofencing = ({ onAlert }) => {
  const [geofences, setGeofences] = useState([]);
  const [newZone, setNewZone] = useState({ name: '', lat: 13.0827, lng: 80.2707, radius: 500 });

  useEffect(() => {
    const saved = localStorage.getItem('geofences');
    if (saved) setGeofences(JSON.parse(saved));
  }, []);

  const addGeofence = () => {
    if (!newZone.name) return;
    const updated = [...geofences, { ...newZone, id: Date.now() }];
    setGeofences(updated);
    localStorage.setItem('geofences', JSON.stringify(updated));
    setNewZone({ ...newZone, name: '' });
  };

  const removeGeofence = (id) => {
    const updated = geofences.filter(g => g.id !== id);
    setGeofences(updated);
    localStorage.setItem('geofences', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Zone name" value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} className="p-2 border rounded" /><input type="number" placeholder="Radius (m)" value={newZone.radius} onChange={(e) => setNewZone({ ...newZone, radius: parseInt(e.target.value) })} className="p-2 border rounded" /></div>
      <Button variant="primary" className="w-full" onClick={addGeofence}><PlusIcon className="w-5 h-5 mr-2" /> Add Safe Zone</Button>
      {geofences.map(zone => (
        <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">{zone.name}</p><p className="text-xs text-gray-500">Radius: {zone.radius}m</p></div>
          <button onClick={() => removeGeofence(zone.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button>
        </div>
      ))}
    </div>
  );
};

export default Geofencing;
