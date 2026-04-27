import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { InstagramIcon, FacebookIcon, TwitterIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SocialMediaScanner = () => {
  const [platform, setPlatform] = useState('instagram');
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
  ];

  const scan = async () => {
    if (!username) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const suspicious = Math.random() > 0.7;
    setResult({
      suspicious,
      fakeProfiles: suspicious ? Math.floor(Math.random() * 3) + 1 : 0,
      confidence: Math.floor(Math.random() * 30 + 70),
      message: suspicious ? 'Suspicious activity detected' : 'Profile appears authentic'
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {platforms.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)} className={`flex-1 p-2 rounded-lg ${platform === p.id ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}>{p.icon} {p.name}</button>
        ))}
      </div>
      <Input placeholder={`${platforms.find(p => p.id === platform)?.name} username`} value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button variant="primary" className="w-full" onClick={scan} loading={loading}>Scan for Fake Profiles</Button>
      {result && (
        <div className={`p-4 rounded-lg ${result.suspicious ? 'bg-danger/10 border-danger' : 'bg-success/10 border-success'}`}>
          <div className="flex items-start gap-3">
            {result.suspicious ? <ExclamationTriangleIcon className="w-5 h-5 text-danger" /> : <ShieldCheckIcon className="w-5 h-5 text-success" />}
            <div><p className="font-bold">{result.message}</p><p className="text-sm">Confidence: {result.confidence}%</p>{result.fakeProfiles > 0 && <p className="text-xs text-danger mt-1">Found {result.fakeProfiles} potential fake profiles</p>}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaScanner;
