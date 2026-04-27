import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { BellIcon, SendIcon, UsersIcon } from '@heroicons/react/24/outline';

const BulkNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendNotification = async () => {
    if (!title || !message) return;
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Notification Title" value={title} onChange={(e) => setTitle(e.target.value)} icon={<BellIcon className="w-5 h-5" />} />
      <textarea rows="4" placeholder="Notification Message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-3 border rounded-lg" />
      <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full p-3 border rounded-lg">
        <option value="all">All Users</option>
        <option value="active">Active Users (Last 7 days)</option>
        <option value="new">New Users (Last 30 days)</option>
        <option value="admin">Admins Only</option>
      </select>
      <Button variant="primary" className="w-full" onClick={sendNotification} loading={sending}><SendIcon className="w-5 h-5 mr-2" /> Send Notification</Button>
      {sent && <div className="p-3 bg-success/10 rounded-lg text-center text-success">Notification sent to {audience} users</div>}
    </div>
  );
};

export default BulkNotifications;
