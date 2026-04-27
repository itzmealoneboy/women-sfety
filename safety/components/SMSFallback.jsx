import { useState } from 'react';
import Button from '../../../components/common/Button';
import { DevicePhoneMobileIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SMSFallback = ({ onSend }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendSMS = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSent(true);
    setSending(false);
    onSend?.();
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg text-center">
      <DevicePhoneMobileIcon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-3">Internet connection lost? Send emergency SMS</p>
      <Button variant="warning" className="w-full" onClick={sendSMS} loading={sending}>
        {sent ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
        {sent ? 'SMS Sent!' : 'Send Emergency SMS'}
      </Button>
    </div>
  );
};

export default SMSFallback;
