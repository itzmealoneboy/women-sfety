import { useState } from 'react';
import Button from '../../../components/common/Button';
import { ScaleIcon, StarIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const LawyerDirectory = () => {
  const [lawyers] = useState([
    { id: 1, name: 'Adv. Priya Sharma', specialization: 'Domestic Violence', experience: '12 years', rating: 4.8, location: 'Chennai', phone: '9876543210' },
    { id: 2, name: 'Adv. Lakshmi Raj', specialization: 'Property Disputes', experience: '15 years', rating: 4.9, location: 'Chennai', phone: '9876543211' },
    { id: 3, name: 'Adv. Meena Krishnan', specialization: 'Cyber Crime', experience: '8 years', rating: 4.7, location: 'Chennai', phone: '9876543212' },
  ]);

  return (
    <div className="space-y-4">
      {lawyers.map(lawyer => (
        <div key={lawyer.id} className="p-4 bg-white rounded-xl shadow">
          <div className="flex justify-between items-start"><h3 className="font-semibold">{lawyer.name}</h3><div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-warning" /><span className="text-sm">{lawyer.rating}</span></div></div>
          <p className="text-sm text-gray-600">{lawyer.specialization}</p>
          <p className="text-xs text-gray-500 mt-1">Experience: {lawyer.experience}</p>
          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500"><MapPinIcon className="w-4 h-4" />{lawyer.location}<PhoneIcon className="w-4 h-4 ml-2" />{lawyer.phone}</div>
          <Button variant="outline" size="sm" className="mt-3 w-full">Contact</Button>
        </div>
      ))}
    </div>
  );
};

export default LawyerDirectory;
