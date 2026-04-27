import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { ClockIcon } from '@heroicons/react/24/outline';

const OTPVerification = ({ onVerify, onResend, email, mobile }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    setLoading(true);
    await onVerify(otpString);
    setLoading(false);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(180);
      onResend();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">
        Verification code sent to: <span className="font-medium">{email || mobile}</span>
      </p>
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input key={index} id={`otp-${index}`} type="text" maxLength="1" value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && index > 0) document.getElementById(`otp-${index - 1}`)?.focus(); }}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none" />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-gray-500"><ClockIcon className="w-4 h-4" /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
        <button onClick={handleResend} disabled={timer > 0} className={`${timer > 0 ? 'text-gray-400' : 'text-primary-600 hover:text-primary-700'}`}>Resend OTP</button>
      </div>
      {error && <p className="text-danger text-sm text-center">{error}</p>}
      <Button variant="primary" className="w-full" onClick={handleVerify} loading={loading}>Verify OTP</Button>
    </div>
  );
};

export default OTPVerification;
