import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFamilyStore } from '../../store/familystore';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const JoinFamily = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteToken = searchParams.get('token');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Please accept or reject the family sharing invitation.');
  const { acceptInvitation, rejectInvitation } = useFamilyStore();

  useEffect(() => {
    if (!inviteToken) {
      setStatus('error');
      setMessage('Invalid invitation link. Please check the invitation and try again.');
    }
  }, [inviteToken]);

  const handleAccept = async () => {
    if (!inviteToken) return;
    setLoading(true);
    const result = await acceptInvitation(inviteToken);
    setLoading(false);

    if (result.success) {
      setStatus('accepted');
      setMessage('Invitation accepted. Your live location sharing is now enabled.');
      toast.success('Family invitation accepted.');
      setTimeout(() => navigate('/safety-navigation'), 1500);
    } else {
      setStatus('error');
      setMessage(result.error || 'Unable to accept the invitation.');
      toast.error(result.error || 'Accept failed.');
    }
  };

  const handleReject = async () => {
    if (!inviteToken) return;
    setLoading(true);
    const result = await rejectInvitation(inviteToken);
    setLoading(false);

    if (result.success) {
      setStatus('rejected');
      setMessage('Invitation rejected. Your location will not be shared.');
      toast.success('Family invitation rejected.');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setStatus('error');
      setMessage(result.error || 'Unable to reject the invitation.');
      toast.error(result.error || 'Reject failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-3xl border border-slate-200 p-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">Family Invite</h1>
        <p className="text-sm text-slate-500 mb-6">This page accepts or rejects a family location sharing invitation.</p>

        <div className="rounded-2xl bg-slate-100 border border-slate-200 p-6 mb-6">
          <p className="text-base text-slate-700 mb-2">Invitation Token:</p>
          <p className="font-mono text-sm text-slate-700 break-all">{inviteToken || 'Not available'}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 mb-6">
          <p className="text-sm text-slate-600">Status:</p>
          <p className={`mt-2 text-lg font-semibold ${status === 'accepted' ? 'text-emerald-600' : status === 'rejected' ? 'text-rose-600' : status === 'error' ? 'text-amber-600' : 'text-slate-900'}`}>
            {status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : status === 'error' ? 'Error' : 'Pending'}
          </p>
          <p className="mt-3 text-sm text-slate-500">{message}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="success" className="w-full sm:w-auto" onClick={handleAccept} disabled={loading || !inviteToken || status === 'accepted'}>
            Accept Invitation
          </Button>
          <Button variant="danger" className="w-full sm:w-auto" onClick={handleReject} disabled={loading || !inviteToken || status === 'rejected'}>
            Reject Invitation
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          {status === 'accepted' && <p>You will be redirected to Safety Navigation shortly.</p>}
          {status === 'rejected' && <p>Thank you. You can close this page or return to the app.</p>}
        </div>
      </div>
    </div>
  );
};

export default JoinFamily;
