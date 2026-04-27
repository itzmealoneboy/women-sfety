import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { UserIcon, ChatBubbleLeftRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ExpertQASession = () => {
  const [sessions] = useState([
    { id: 1, expert: 'Adv. Priya Sharma', topic: 'Legal Rights for Women', date: '2024-04-15', time: '5:00 PM', slots: 15 },
    { id: 2, expert: 'Dr. Meena Krishnan', topic: 'Mental Health Awareness', date: '2024-04-18', time: '6:00 PM', slots: 20 },
    { id: 3, expert: 'Rahul Verma', topic: 'Self Defense Techniques', date: '2024-04-20', time: '4:00 PM', slots: 10 },
  ]);
  const [question, setQuestion] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  const register = (session) => {
    alert(`Registered for ${session.topic} with ${session.expert}`);
    setSelectedSession(session);
  };

  const askQuestion = () => {
    if (!question) return;
    alert(`Your question has been submitted to ${selectedSession?.expert}`);
    setQuestion('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {sessions.map(session => (
          <div key={session.id} className="p-4 bg-white rounded-xl shadow">
            <div className="flex justify-between"><h3 className="font-semibold">{session.topic}</h3><span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">{session.slots} slots left</span></div>
            <p className="text-sm text-gray-600 mt-1">by {session.expert}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500"><CalendarIcon className="w-4 h-4" />{session.date} at {session.time}</div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => register(session)}>Register for Session</Button>
          </div>
        ))}
      </div>
      {selectedSession && (
        <div className="p-4 bg-primary-50 rounded-lg">
          <h4 className="font-medium mb-2">Ask a Question to {selectedSession.expert}</h4>
          <div className="flex gap-2"><Input placeholder="Type your question..." value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-1" /><Button variant="primary" onClick={askQuestion}><ChatBubbleLeftRightIcon className="w-5 h-5" /></Button></div>
        </div>
      )}
    </div>
  );
};

export default ExpertQASession;
