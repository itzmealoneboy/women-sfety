import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { MapIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const OfflineMaps = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [offlineMaps, setOfflineMaps] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('offlineMaps');
    if (saved) setOfflineMaps(JSON.parse(saved));
  }, []);

  const downloadMap = async () => {
    setDownloading(true);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    const newMap = { id: Date.now(), name: 'Chennai Region', size: '245 MB', date: new Date().toLocaleDateString() };
    const updated = [...offlineMaps, newMap];
    setOfflineMaps(updated);
    localStorage.setItem('offlineMaps', JSON.stringify(updated));
    setDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const deleteMap = (id) => {
    const updated = offlineMaps.filter(m => m.id !== id);
    setOfflineMaps(updated);
    localStorage.setItem('offlineMaps', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <Button variant="primary" className="w-full" onClick={downloadMap} loading={downloading}><ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Download Offline Map</Button>
      {downloading && <div className="h-2 bg-gray-200 rounded-full"><div className="h-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} /></div>}
      {downloaded && <div className="p-2 bg-success/10 text-success rounded-lg text-center"><CheckCircleIcon className="w-4 h-4 inline mr-1" /> Map downloaded!</div>}
      {offlineMaps.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Downloaded Maps</p>
          {offlineMaps.map(map => (
            <div key={map.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium">{map.name}</p><p className="text-xs text-gray-500">{map.size} • {map.date}</p></div>
              <button onClick={() => deleteMap(map.id)} className="text-red-500 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfflineMaps;
