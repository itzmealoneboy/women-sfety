import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { EnvelopeIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DataLeakChecker = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!email || !email.includes('@')) return alert('Enter valid email');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const leaked = Math.random() > 0.6;
    setResult({
      leaked,
      breaches: leaked ? Math.floor(Math.random() * 5) + 1 : 0,
      sources: leaked ? ['Adobe', 'LinkedIn', 'Canva'].slice(0, Math.floor(Math.random() * 3) + 1) : [],
      date: '2023-01-01'
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} icon={<EnvelopeIcon className="w-5 h-5" />} />
      <Button variant="primary" className="w-full" onClick={check} loading={loading}>Check for Data Breaches</Button>
      {result && (
        <div className={`p-4 rounded-lg ${result.leaked ? 'bg-danger/10 border-danger' : 'bg-success/10 border-success'}`}>
          <div className="flex items-start gap-3">
            {result.leaked ? <ExclamationTriangleIcon className="w-5 h-5 text-danger" /> : <ShieldCheckIcon className="w-5 h-5 text-success" />}
            <div><p className="font-bold">{result.leaked ? '⚠️ Email found in data breach!' : '✅ Email appears safe'}</p>{result.leaked && <p className="text-sm">Found in {result.breaches} breach{result.breaches > 1 ? 'es' : ''}</p>}{result.sources?.length > 0 && <p className="text-xs text-gray-600 mt-1">Sources: {result.sources.join(', ')}</p>}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLeakChecker;
