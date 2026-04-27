import React, { useState, useEffect } from 'react';
import { 
  DevicePhoneMobileIcon,
  DocumentTextIcon, 
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CyberCrimePortal = () => {
  const [complaints, setComplaints] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Fake Profile',
    platform: 'Instagram',
    url: '',
    description: '',
    evidence: null
  });

  // Load from offline storage
  useEffect(() => {
    const saved = localStorage.getItem('cyber_complaints');
    if (saved) {
      setComplaints(JSON.parse(saved));
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, evidence: e.target.files[0].name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.url || !formData.description) {
      toast.error('Please provide the URL and description of the incident.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Encrypting and securing complaint payload...');

    // Simulate backend processing delay
    setTimeout(() => {
      const generatedId = `CYB-${Math.floor(100000 + Math.random() * 900000)}`;
      const newComplaint = {
        id: generatedId,
        date: new Date().toLocaleDateString(),
        type: formData.type,
        platform: formData.platform,
        status: 'Under Investigation',
        evidence: formData.evidence ? 'Attached' : 'None'
      };

      const updatedList = [newComplaint, ...complaints];
      setComplaints(updatedList);
      localStorage.setItem('cyber_complaints', JSON.stringify(updatedList));

      setIsSubmitting(false);
      setFormData({
        type: 'Fake Profile',
        platform: 'Instagram',
        url: '',
        description: '',
        evidence: null
      });

      toast.success(`Complaint successfully logged! Reference ID: ${generatedId}`, { id: toastId, duration: 5000 });
    }, 2000);
  };

  return (
    <div className="bg-[#f5f6f8] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-6 pb-20 font-sans">
      
      {/* Header */}
      <div className="pt-2 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#3a3f45] flex items-center gap-2">
            <FingerPrintIcon className="w-8 h-8 text-[#56bc56] stroke-2" /> Cyber Crime Portal
            </h1>
            <p className="text-gray-500 mt-2 font-semibold text-[15px]">
            Report online harassment, fake profiles, and image misuse directly to the cyber cell.
            </p>
        </div>

        <a 
          href="https://cybercrime.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 transition-colors px-6 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2 flex-shrink-0"
        >
          National Portal <ArrowTopRightOnSquareIcon className="w-5 h-5 stroke-2 text-[#ff556c]" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 xl:gap-8">
        
        {/* File Complaint Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 lg:col-span-2 h-fit">
          <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
             <ShieldExclamationIcon className="w-6 h-6 text-[#56bc56] stroke-2" /> Secure Filing Interface
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Category</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[#7c56c2] text-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                <option>Fake Profile</option>
                <option>Online Harassment</option>
                <option>Image Misuse (Revenge Porn)</option>
                <option>Blackmail & Extortion</option>
                <option>Cyberstalking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Digital Platform</label>
              <select 
                value={formData.platform}
                onChange={e => setFormData({...formData, platform: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[#7c56c2] text-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                <option>Instagram</option>
                <option>Facebook</option>
                <option>WhatsApp</option>
                <option>Twitter / X</option>
                <option>Snapchat</option>
                <option>Other Network</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Suspect Profile / Post URL</label>
              <input 
                type="url" 
                placeholder="https://" 
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[#7c56c2] text-gray-800"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Detailed Statement</label>
              <textarea 
                placeholder="Explain what happened. Include dates and times if possible..." 
                rows="4" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[#7c56c2] text-gray-800 resize-none"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Evidence Upload</label>
              <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
                 <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                 />
                 <DocumentTextIcon className="w-8 h-8 text-gray-400 mb-2 stroke-2" />
                 <span className="text-gray-600 font-bold text-sm">
                   {formData.evidence ? formData.evidence : 'Tap to attach Screenshots / PDFs'}
                 </span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#333] hover:bg-black transition-colors text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm mt-4 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
            >
              {isSubmitting ? 'Encrypting Payload...' : 'File Official Complaint'}
            </button>
          </form>
        </div>

        {/* My Complaints Dashboard */}
        <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-[#333] mb-1">{complaints.length}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Filed</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-[#fdb022] mb-1">{complaints.filter(c => c.status.includes('Investig')).length}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Investigating</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-[#56bc56] mb-1">{complaints.filter(c => c.status === 'Resolved').length}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Resolved</div>
                </div>
                <div className="bg-[#ff556c] p-5 rounded-3xl border border-[#eb4c60] shadow-sm shadow-red-200 text-center flex flex-col items-center justify-center text-white cursor-pointer hover:bg-[#eb4c60] transition-colors" onClick={() => { localStorage.removeItem('cyber_complaints'); setComplaints([]); }}>
                    <DocumentTextIcon className="w-8 h-8 mb-2" />
                    <div className="text-[11px] font-bold text-red-100 uppercase tracking-widest">Clear Records</div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex-grow">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                        <ClockIcon className="w-6 h-6 text-[#7c56c2] stroke-2" /> Complaint Tracking Ledger
                    </h2>
                </div>
                
                {complaints.length === 0 ? (
                    <div className="text-gray-400 py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <ShieldExclamationIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <span className="font-bold">No cyber crime complaints on record.</span>
                        <span className="text-xs mt-1 px-4">If you are facing harassment, use the secure form to file a protected complaint.</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] font-bold">
                                    <th className="pb-4 pl-2">Ticket ID</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Infraction</th>
                                    <th className="pb-4">Network</th>
                                    <th className="pb-4">Tracking Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map(complaint => (
                                    <tr key={complaint.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2">
                                            <span className="font-mono text-xs font-bold text-[#7c56c2] bg-purple-50 px-2 py-1 rounded">
                                                {complaint.id}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-semibold text-gray-600">{complaint.date}</td>
                                        <td className="py-4 text-sm font-bold text-gray-800">{complaint.type}</td>
                                        <td className="py-4">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                                                {complaint.platform}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className="flex items-center gap-1 text-[#fdb022] text-xs font-bold bg-orange-50 px-3 py-1.5 rounded-full w-fit">
                                                <ClockIcon className="w-3.5 h-3.5 stroke-2" /> {complaint.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>

      </div>

    </div>
  );
};

export default CyberCrimePortal;
