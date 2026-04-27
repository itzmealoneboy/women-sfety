import { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import { MapPinIcon, CameraIcon, StarIcon } from '@heroicons/react/24/outline';

const SafeParking = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setParkingSpots([
        { id: 1, name: 'T Nagar Parking', address: 'Near Bus Stand', distance: '200m', security: 'CCTV', lighting: 'Good', rating: 4.5, womenOnly: true },
        { id: 2, name: 'Anna Nagar Tower', address: '2nd Avenue', distance: '500m', security: 'Guard', lighting: 'Excellent', rating: 4.8, womenOnly: false },
        { id: 3, name: 'Mylapore Parking', address: 'North Mada St', distance: '800m', security: 'CCTV', lighting: 'Moderate', rating: 4.2, womenOnly: true },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="text-center py-4">Finding safe parking...</div>;

  return (
    <div className="space-y-4">
      {parkingSpots.map(spot => (
        <div key={spot.id} className="p-4 bg-white rounded-xl shadow">
          <div className="flex justify-between"><h3 className="font-semibold">{spot.name}</h3><span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">{spot.distance}</span></div>
          <p className="text-sm text-gray-600 mt-1">{spot.address}</p>
          <div className="flex items-center gap-3 mt-2 text-sm"><span className="flex items-center gap-1"><CameraIcon className="w-4 h-4" />{spot.security}</span><span>💡 {spot.lighting}</span>{spot.womenOnly && <span className="text-pink-600">👩 Women Only</span>}</div>
          <div className="flex items-center justify-between mt-3"><div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-warning" /><span>{spot.rating}</span></div><Button variant="outline" size="sm"><MapPinIcon className="w-4 h-4 mr-1" /> Navigate</Button></div>
        </div>
      ))}
    </div>
  );
};

export default SafeParking;
