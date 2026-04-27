import { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { MegaphoneIcon, TrashIcon, PinIcon } from '@heroicons/react/24/outline';

const AnnouncementSystem = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    const saved = localStorage.getItem('announcements');
    if (saved) setAnnouncements(JSON.parse(saved));
  }, []);

  const addAnnouncement = () => {
    if (!title || !content) return;
    const newAnnouncement = {
      id: Date.now(),
      title,
      content,
      priority,
      date: new Date().toLocaleString(),
      pinned: false
    };
    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
    setTitle('');
    setContent('');
  };

  const togglePin = (id) => {
    const updated = announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Announcement Title" value={title} onChange={(e) => setTitle(e.target.value)} icon={<MegaphoneIcon className="w-5 h-5" />} />
      <textarea rows="3" placeholder="Announcement Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-3 border rounded-lg" />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-3 border rounded-lg"><option value="normal">Normal</option><option value="high">High Priority</option><option value="urgent">Urgent</option></select>
      <Button variant="primary" className="w-full" onClick={addAnnouncement}>Post Announcement</Button>
      {announcements.map(ann => (
        <div key={ann.id} className={`p-4 rounded-lg ${ann.priority === 'urgent' ? 'bg-danger/10 border-l-4 border-danger' : ann.priority === 'high' ? 'bg-warning/10 border-l-4 border-warning' : 'bg-gray-50'}`}>
          <div className="flex justify-between"><h4 className="font-semibold">{ann.title}</h4><div className="flex gap-2"><button onClick={() => togglePin(ann.id)}><PinIcon className={`w-4 h-4 ${ann.pinned ? 'text-primary-500' : 'text-gray-400'}`} /></button><button onClick={() => deleteAnnouncement(ann.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button></div></div>
          <p className="text-sm mt-1">{ann.content}</p>
          <p className="text-xs text-gray-400 mt-2">{ann.date}</p>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementSystem;
