import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete, onResend, email, isResending = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setActiveIndex(index + 1);
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1].focus();
        setActiveIndex(index - 1);
      }
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex].focus();
        setActiveIndex(nextEmptyIndex);
      } else if (newOtp.every(digit => digit !== '')) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleResend = () => {
    if (canResend && !isResending) {
      onResend();
      setTimeLeft(30);
      setCanResend(false);
      setOtp(new Array(length).fill(''));
      setActiveIndex(0);
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="otp-input-container">
      <div className="otp-header">
        <h3>Enter Verification Code</h3>
        <p>We've sent a 6-digit code to {email || 'your email'}</p>
      </div>

      <div className="otp-fields">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`otp-input ${activeIndex === index ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="otp-actions">
        <button 
          onClick={handleResend}
          disabled={!canResend || isResending}
          className="resend-button"
        >
          {isResending ? 'Sending...' : canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
        </button>
      </div>

      <style jsx>{`
        .otp-input-container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 400px;
          margin: 0 auto;
        }

        .otp-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .otp-header h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .otp-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .otp-fields {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .otp-input {
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
          outline: none;
        }

        .otp-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .otp-input.active {
          border-color: #007bff;
        }

        .otp-actions {
          text-align: center;
        }

        .resend-button {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .resend-button:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .resend-button:disabled {
          color: #999;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .otp-input {
            width: 40px;
            height: 50px;
            font-size: 20px;
          }

          .otp-fields {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default OTPInput;
