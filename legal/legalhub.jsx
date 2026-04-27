import React, { useState } from 'react';
import { 
  PhoneIcon,
  CalendarIcon,
  ScaleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import { 
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LegalHub = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    caseType: '',
    description: '',
    confirmed: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.confirmed) {
      toast.error('Please confirm your eligibility criteria.');
      return;
    }
    toast.success('Your Legal Aid Application has been submitted successfully!');
  };

  const handleRegisterLokAdalat = (e) => {
    e.preventDefault();
    toast.success('Lok Adalat registration initiated!');
  };

  const handleTrackApplication = (e) => {
    e.preventDefault();
    toast.success('Fetching application status...');
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-6 pb-20 font-sans">
      
      {/* Header */}
      <div className="pt-2 pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3a3f45] flex items-center gap-3">
          <span className="text-[#3a3f45] text-3xl">⚖️</span> Legal Aid & Lok Adalat
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-sm">
          ALSA 15100 free legal aid and Lok Adalat case registration
        </p>
      </div>

      {/* Helpline Banner */}
      <div className="bg-[#66bb6a] text-white p-4 rounded-md flex items-center gap-3 mb-4 shadow-sm w-full">
        <PhoneIcon className="w-6 h-6 text-white transform -scale-x-100" />
        <span className="font-bold text-lg md:text-xl">15100 - FREE LEGAL AID HELPLINE <span className="font-normal text-base md:text-lg">(Toll Free)</span></span>
      </div>

      {/* Date Pill */}
      <div className="inline-flex items-center gap-2 bg-[#ff556c] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
        <CalendarIcon className="w-5 h-5" /> Next National Lok Adalat: 12th April 2025
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            ⚖️ Free Legal Aid Services
          </h2>
          <ul className="space-y-2 mb-4 text-[#333]">
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Free lawyer consultation</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Free legal advice</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Court fee exemption</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Drafting of petitions</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Free legal representation</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-black">When to Call:</span> Domestic Violence, Property, Divorce, Harassment, Dowry, Child Custody, Cybercrime
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            ⚖️ Lok Adalat (People's Court)
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Free and fast dispute resolution - No court fees. Cases settled amicably.
          </p>
          <ul className="space-y-2 text-[#333]">
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Family disputes</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Motor accident claims</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Bank recovery cases</li>
            <li className="flex items-start gap-2"><CheckCircleIcon className="w-5 h-5 text-[#4caf50] mt-0.5 shrink-0" /> Land disputes</li>
          </ul>
        </div>
      </div>

      {/* Apply Form */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
          📄 Apply for Free Legal Aid
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" placeholder="Enter your name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" placeholder="Enter phone" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2] text-gray-600 bg-white">
                <option>Select District</option>
                <option>Chennai</option>
                <option>Coimbatore</option>
                <option>Madurai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2] text-gray-600 bg-white">
                <option>Select Case Type</option>
                <option>Domestic Violence</option>
                <option>Property</option>
                <option>Divorce</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Description</label>
            <textarea placeholder="Describe your case.." rows="3" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7c56c2]"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents</label>
            <div className="w-full border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-3">
               <div className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-200">
                 Choose Files
               </div>
               <span className="text-gray-500 text-sm">No file chosen</span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input 
              type="checkbox" 
              checked={formData.confirmed} 
              onChange={(e) => setFormData({...formData, confirmed: e.target.checked})}
              className="w-4 h-4 rounded text-[#4caf50] border-gray-300 focus:ring-green-500"
            />
            <span className="text-sm text-gray-800 font-medium">I confirm eligibility (annual income {'<'} ₹3,00,000)</span>
          </label>

          <button type="submit" className="w-full bg-[#56bc56] hover:bg-[#4caf50] transition-colors text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm mt-2 focus:outline-none">
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 -mt-1" /> Submit Application
          </button>
        </form>
      </div>

      {/* Upcoming Lok Adalats */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
          📅 Upcoming Lok Adalats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 bg-white border-l-[3px] border-blue-500 shadow-sm rounded-r-xl p-4 ml-[2px]">
            <CalendarIcon className="w-6 h-6 text-black shrink-0" />
            <div>
              <h4 className="font-bold text-[15px] text-black">Chennai</h4>
              <p className="text-[13px] text-gray-600">12-04-2025 at District Court Complex</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border-l-[3px] border-blue-500 shadow-sm rounded-r-xl p-4 ml-[2px]">
            <CalendarIcon className="w-6 h-6 text-black shrink-0" />
            <div>
              <h4 className="font-bold text-[15px] text-black">Madurai</h4>
              <p className="text-[13px] text-gray-600">12-04-2025 at High Court Bench</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border-l-[3px] border-blue-500 shadow-sm rounded-r-xl p-4 ml-[2px]">
            <CalendarIcon className="w-6 h-6 text-black shrink-0" />
            <div>
              <h4 className="font-bold text-[15px] text-black">Coimbatore</h4>
              <p className="text-[13px] text-gray-600">12-04-2025 at District Court</p>
            </div>
          </div>
        </div>
      </div>

      {/* Register Case */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
           <ClipboardDocumentCheckIcon className="w-6 h-6 text-black stroke-2" /> Register Case for Lok Adalat
        </h2>
        <form onSubmit={handleRegisterLokAdalat} className="flex flex-col md:flex-row gap-5 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2] text-gray-600 bg-white">
              <option>Family Dispute</option>
              <option>Property Dispute</option>
              <option>Bank Recovery</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2] text-gray-600 bg-white">
              <option>Chennai</option>
              <option>Madurai</option>
              <option>Coimbatore</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <button type="submit" className="w-full bg-[#7c56c2] hover:bg-[#6c48a7] transition-colors text-white py-2.5 rounded-lg font-bold shadow-sm focus:outline-none text-[15px]">
              Register Case
            </button>
          </div>
        </form>
      </div>

      {/* Track Application */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row gap-5 items-end">
         <div className="w-full md:w-full">
            <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
               <MagnifyingGlassIcon className="w-6 h-6 text-black stroke-2" /> Track Legal Aid Application
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
            <input type="text" placeholder="Enter ID (e.g., LEG-123456)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c56c2]" />
         </div>
         <button onClick={handleTrackApplication} className="w-full md:w-auto md:px-12 bg-[#7c56c2] hover:bg-[#6c48a7] transition-colors text-white py-2.5 rounded-lg font-bold shadow-sm focus:outline-none text-[15px] whitespace-nowrap">
            Track Status
         </button>
      </div>

    </div>
  );
};

export default LegalHub;
