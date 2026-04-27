import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { KeyIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PasswordBreachChecker = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!password) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const compromised = Math.random() > 0.7;
    setResult({
      compromised,
      timesSeen: compromised ? Math.floor(Math.random() * 1000) + 10 : 0,
      recommendation: compromised ? 'Use a stronger, unique password' : 'Password appears safe'
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input type="password" placeholder="Enter password to check" value={password} onChange={(e) => setPassword(e.target.value)} icon={<KeyIcon className="w-5 h-5" />} />
      <Button variant="primary" className="w-full" onClick={check} loading={loading}>Check Password</Button>
      {result && (
        <div className={`p-4 rounded-lg ${result.compromised ? 'bg-danger/10 border-danger' : 'bg-success/10 border-success'}`}>
          <div className="flex items-start gap-3">
            {result.compromised ? <ExclamationTriangleIcon className="w-5 h-5 text-danger" /> : <ShieldCheckIcon className="w-5 h-5 text-success" />}
            <div><p className="font-bold">{result.compromised ? '⚠️ Password compromised!' : '✅ Password appears safe'}</p>{result.compromised && <p className="text-sm">Found in {result.timesSeen} data breaches</p>}<p className="text-xs text-gray-600 mt-1">{result.recommendation}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordBreachChecker;import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { KeyIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PasswordBreachChecker = () => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!password) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const compromised = Math.random() > 0.7;
    setResult({
      compromised,
      timesSeen: compromised ? Math.floor(Math.random() * 1000) + 10 : 0,
      recommendation: compromised ? 'Use a stronger, unique password' : 'Password appears safe'
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input type="password" placeholder="Enter password to check" value={password} onChange={(e) => setPassword(e.target.value)} icon={<KeyIcon className="w-5 h-5" />} />
      <Button variant="primary" className="w-full" onClick={check} loading={loading}>Check Password</Button>
      {result && (
        <div className={`p-4 rounded-lg ${result.compromised ? 'bg-danger/10 border-danger' : 'bg-success/10 border-success'}`}>
          <div className="flex items-start gap-3">
            {result.compromised ? <ExclamationTriangleIcon className="w-5 h-5 text-danger" /> : <ShieldCheckIcon className="w-5 h-5 text-success" />}
            <div><p className="font-bold">{result.compromised ? '⚠️ Password compromised!' : '✅ Password appears safe'}</p>{result.compromised && <p className="text-sm">Found in {result.timesSeen} data breaches</p>}<p className="text-xs text-gray-600 mt-1">{result.recommendation}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordBreachChecker;
