import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { PhoneIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PhoneNumberChecker = () => {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!phone || phone.length !== 10) return alert('Enter valid 10-digit number');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const scams = ['9876543210', '9123456789'];
    const isScam = scams.includes(phone);
    setResult({ scam: isScam, message: isScam ? '⚠️ This number is reported for scams!' : '✅ This number appears safe' });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" icon={<PhoneIcon className="w-5 h-5" />} maxLength="10" />
      <Button variant="primary" className="w-full" onClick={check} loading={loading}>Check Number</Button>
      {result && (
        <div className={`p-4 rounded-lg ${!result.scam ? 'bg-success/10 border border-success' : 'bg-danger/10 border border-danger'}`}>
          <div className="flex items-start gap-3">
            {!result.scam ? <ShieldCheckIcon className="w-5 h-5 text-success" /> : <ExclamationTriangleIcon className="w-5 h-5 text-danger" />}
            <p className="text-sm">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberChecker;
