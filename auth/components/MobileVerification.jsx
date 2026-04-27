import { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { PhoneIcon } from '@heroicons/react/24/outline';
import OTPVerification from './OTPVerification';

const MobileVerification = ({ onVerified }) => {
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!mobile || mobile.length !== 10) return alert('Enter valid 10-digit number');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOtpSent(true);
    setLoading(false);
  };

  const verifyOTP = async (otp) => {
    if (otp === '123456') onVerified(mobile);
    else alert('Invalid OTP');
  };

  const resendOTP = () => {};

  return (
    <div className="space-y-4">
      {!otpSent ? (
        <>
          <Input label="Mobile Number" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" icon={<PhoneIcon className="w-5 h-5" />} />
          <Button variant="primary" className="w-full" onClick={sendOTP} loading={loading}>Send OTP</Button>
        </>
      ) : (
        <OTPVerification onVerify={verifyOTP} onResend={resendOTP} mobile={mobile} />
      )}
    </div>
  );
};

export default MobileVerification;
