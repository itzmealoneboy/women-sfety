import { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { MapPinIcon, ShareIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

const RouteSharing = () => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [shared, setShared] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [shareLink, setShareLink] = useState('');

  const shareRoute = async () => {
    if (!start || !destination) return alert('Enter start and destination');
    const link = `${window.location.origin}/route?from=${encodeURIComponent(start)}&to=${encodeURIComponent(destination)}`;
    setShareLink(link);
    const qr = await QRCode.toDataURL(link);
    setQrCode(qr);
    setShared(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check my route: ${shareLink}`)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <Input label="Start Location" value={start} onChange={(e) => setStart(e.target.value)} icon={<MapPinIcon className="w-5 h-5" />} placeholder="Current location" />
      <Input label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} icon={<MapPinIcon className="w-5 h-5" />} placeholder="Enter destination" />
      <Button variant="primary" className="w-full" onClick={shareRoute}><ShareIcon className="w-5 h-5 mr-2" /> Share Route</Button>
      {shared && (
        <div className="space-y-3">
          {qrCode && <img src={qrCode} alt="Route QR" className="w-32 h-32 mx-auto" />}
          <div className="flex gap-2"><input type="text" value={shareLink} readOnly className="flex-1 p-2 border rounded text-sm" /><Button variant="outline" size="sm" onClick={copyLink}>Copy</Button></div>
          <Button variant="success" className="w-full" onClick={shareWhatsApp}>Share on WhatsApp</Button>
        </div>
      )}
    </div>
  );
};

export default RouteSharing;
