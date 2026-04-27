import { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

const FakeCallCustomizer = ({ onTrigger }) => {
  const [caller, setCaller] = useState('mother');
  const [message, setMessage] = useState('');
  const [delay, setDelay] = useState(3);

  const callers = [
    { id: 'mother', name: 'Mother / Amma' },
    { id: 'father', name: 'Father / Appa' },
    { id: 'brother', name: 'Brother / Anna' },
    { id: 'sister', name: 'Sister / Akka' },
    { id: 'police', name: 'Police Officer' },
    { id: 'friend', name: 'Friend' }
  ];

  const messages = {
    mother: "Dear! Come home immediately, father is not well",
    father: "My daughter, where are you? I'm waiting at the gate",
    brother: "Sister! Where are you? Mom is calling you",
    sister: "Akka, dinner is ready. Come home soon",
    police: "Do you need help? This is the police station calling",
    friend: "Hey! Where are you? Coming to the party?"
  };

  const handleTrigger = () => {
    const callMessage = message || messages[caller];
    onTrigger({ caller: callers.find(c => c.id === caller)?.name, message: callMessage, delay });
  };

  return (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-2">Caller</label><div className="grid grid-cols-3 gap-2">{callers.map(c => <button key={c.id} onClick={() => setCaller(c.id)} className={`p-2 rounded-lg border-2 ${caller === c.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>{c.name}</button>)}</div></div>
      <Input label="Custom Message (Optional)" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter custom message" icon={<UserIcon className="w-5 h-5" />} />
      <div><label className="block text-sm font-medium mb-2">Delay: {delay}s</label><input type="range" min="0" max="10" value={delay} onChange={(e) => setDelay(parseInt(e.target.value))} className="w-full" /></div>
      <Button variant="primary" className="w-full" onClick={handleTrigger}><PhoneIcon className="w-5 h-5 mr-2" /> Trigger Fake Call</Button>
    </div>
  );
};

export default FakeCallCustomizer;
