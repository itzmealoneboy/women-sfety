import { useState, useRef } from 'react';
import Button from '../../../components/common/Button';
import { IdentificationIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AadharVerification = ({ onVerified }) => {
  const [uploaded, setUploaded] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setData({ number: '1234 5678 9012', name: 'Demo User', dob: '15/05/1995', gender: 'Female' });
      setUploaded(true);
      setLoading(false);
    }, 2000);
  };

  const verify = () => {
    const age = new Date().getFullYear() - new Date(data.dob.split('/').reverse().join('-')).getFullYear();
    if (data.gender !== 'Female') return alert('Must be Female');
    if (age < 18) return alert('Must be 18+');
    onVerified({ ...data, age });
  };

  return (
    <div className="space-y-4">
      {!uploaded ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
          <IdentificationIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-primary-600 font-medium">Click to upload Aadhar card</p>
          <p className="text-xs text-gray-500 mt-1">Upload front and back photos</p>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p><span className="font-medium">Aadhar:</span> {data.number}</p>
          <p><span className="font-medium">Name:</span> {data.name}</p>
          <p><span className="font-medium">DOB:</span> {data.dob}</p>
          <p><span className="font-medium">Gender:</span> {data.gender}</p>
          <Button variant="success" className="w-full mt-2" onClick={verify}>Verify Aadhar</Button>
        </div>
      )}
      {loading && <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div></div>}
    </div>
  );
};

export default AadharVerification;
