import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const RegistrationComplete = ({ userData }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-success/20 rounded-full mx-auto flex items-center justify-center animate-bounce">
        <CheckCircleIcon className="w-10 h-10 text-success" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">🎉 Registration Complete!</h3>
      <div className="bg-primary-50 p-4 rounded-lg space-y-2 text-left">
        <p className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-success" /> Email: {userData?.email} ✓ Verified</p>
        <p className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-success" /> Mobile: +91 {userData?.mobile} ✓ Verified</p>
        <p className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-success" /> Aadhar: ✓ Verified (Age {userData?.age})</p>
      </div>
      <Link to="/login"><Button variant="primary" className="w-full">Go to Login</Button></Link>
    </div>
  );
};

export default RegistrationComplete;
