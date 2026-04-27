import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import {
  ComputerDesktopIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CameraIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  CloudArrowUpIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import { ShieldExclamationIcon as ShieldExclamationIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const CyberCrimePortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('report');
  const [complaintType, setComplaintType] = useState('online');
  const [complaintData, setComplaintData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: '',
    url: '',
    description: '',
    evidence: [],
    date: '',
    suspectInfo: ''
  });
  const [complaints, setComplaints] = useState([]);
  const [trackingId, setTrackingId] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [uploading, setUploading] = useState(false);

  const tabs = [
    { id: 'report', name: 'File Complaint', icon: DocumentTextIcon },
    { id: 'track', name: 'Track Complaint', icon: MagnifyingGlassIcon },
    { id: 'resources', name: 'Resources', icon: ShieldExclamationIcon },
    { id: 'history', name: 'My Complaints', icon: ClockIcon }
  ];

  const complaintTypes = [
    { id: 'online', name: 'Online Harassment', icon: '💬' },
    { id: 'fake', name: 'Fake Profile', icon: '👤' },
    { id: 'image', name: 'Image Misuse', icon: '📸' },
    { id: 'blackmail', name: 'Blackmail', icon: '💰' },
    { id: 'stalking', name: 'Cyber Stalking', icon: '👁️' },
    { id: 'fraud', name: 'Online Fraud', icon: '💳' },
    { id: 'identity', name: 'Identity Theft', icon: '🆔' },
    { id: 'other', name: 'Other', icon: '📌' }
  ];

  const platforms = [
    'Instagram',
    'Facebook',
    'Twitter/X',
    'WhatsApp',
    'Telegram',
    'LinkedIn',
    'Snapchat',
    'YouTube',
    'TikTok',
    'Other'
  ];

  const helplines = [
    { name: 'Cyber Crime Helpline', number: '1930', description: 'National Cyber Crime Reporting' },
    { name: 'Women Helpline', number: '1091', description: 'Women in distress' },
    { name: 'Police', number: '100', description: 'Emergency' },
    { name: 'Child Helpline', number: '1098', description: 'Children in need' }
  ];

  const resources = [
    {
      title: 'National Cyber Crime Portal',
      url: 'https://cybercrime.gov.in',
      description: 'Official portal for reporting cyber crimes',
      icon: '🌐'
    },
    {
      title: 'Indian Computer Emergency Response Team',
      url: 'https://www.cert-in.org.in',
      description: 'CERT-In for security incidents',
      icon: '🛡️'
    },
    {
      title: 'National Commission for Women',
      url: 'http://ncw.nic.in',
      description: 'NCW for women's rights',
      icon: '👩'
    },
    {
      title: 'Ministry of Home Affairs',
      url: 'https://www.mha.gov.in',
      description: 'MHA cyber safety resources',
      icon: '🏛️'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    // Simulate upload
    setTimeout(() => {
      setComplaintData(prev => ({
        ...prev,
        evidence: [...prev.evidence, ...files.map(f => f.name)]
      }));
      setUploading(false);
      toast.success(`${files.length} file(s) uploaded`);
    }, 1500);
  };

  const handleSubmitComplaint = () => {
    if (!complaintData.name || !complaintData.email || !complaintData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const newComplaint = {
      id: 'CYC-' + Date.now().toString().slice(-6),
      ...complaintData,
      type: complaintType,
      status: 'Filed',
      date: new Date().toLocaleString(),
      updates: [
        { date: new Date().toLocaleString(), message: 'Complaint filed successfully' }
      ]
    };

    setComplaints([newComplaint, ...complaints]);
    toast.success(`Complaint filed! Reference ID: ${newComplaint.id}`);
    
    // Reset form
    setComplaintData({
      name: '',
      email: '',
      phone: '',
      platform: '',
      url: '',
      description: '',
      evidence: [],
      date: '',
      suspectInfo: ''
    });
  };

  const handleTrackComplaint = () => {
    if (!trackingId) {
      toast.error('Please enter complaint ID');
      return;
    }

    const complaint = complaints.find(c => c.id === trackingId);
    
    if (complaint) {
      setTrackedComplaint(complaint);
      toast.success('Complaint found');
    } else {
      toast.error('Complaint not found');
      setTrackedComplaint(null);
    }
  };

  const callHelpline = (number) => {
    window.location.href = `tel:${number}`;
  };

  const openWebsite = (url) => {
    window.open(url, '_blank');
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('Tracking ID copied');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          💻 Cyber Crime Portal
        </h1>
        <p className="text-gray-600 mt-1">
          Report online harassment, fake profiles, image misuse, and cyber crimes
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PhoneIcon className="w-6 h-6" />
            <div>
              <p className="font-bold">National Cyber Crime Helpline</p>
              <p className="text-sm opacity-90">24/7 Toll Free</p>
            </div>
          </div>
          <Button
            variant="white"
            onClick={() => callHelpline('1930')}
          >
            Call 1930
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* File Complaint Tab */}
        {activeTab === 'report' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Complaint Form */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">File Cyber Crime Complaint</h3>

              <div className="space-y-4">
                {/* Complaint Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Type
                  </label>
                  <select
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {complaintTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={complaintData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    name="email"
                    value={complaintData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>

                <Input
                  label="Phone Number"
                  name="phone"
                  value={complaintData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                />

                {/* Incident Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      name="platform"
                      value={complaintData.platform}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Select Platform</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Date of Incident"
                    type="date"
                    name="date"
                    value={complaintData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  label="URL / Profile Link"
                  name="url"
                  value={complaintData.url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  icon={<LinkIcon className="w-5 h-5" />}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                  </label>
                  <textarea
                    name="description"
                    value={complaintData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Describe the incident in detail..."
                  />
                </div>

                <Input
                  label="Suspect Information (if known)"
                  name="suspectInfo"
                  value={complaintData.suspectInfo}
                  onChange={handleInputChange}
                  placeholder="Username, phone number, email, etc."
                />

                {/* Evidence Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Evidence (Screenshots, Documents)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence-upload"
                    />
                    <label
                      htmlFor="evidence-upload"
                      className="cursor-pointer"
                    >
                      <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Images, PDF, DOC (Max 10MB each)
                      </p>
                    </label>
                  </div>

                  {complaintData.evidence.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Uploaded files:</p>
                      {complaintData.evidence.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircleIcon className="w-4 h-4 text-success" />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSubmitComplaint}
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  File Complaint
                </Button>
              </div>
            </Card>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Helpline Numbers */}
              <Card>
                <h4 className="font-semibold mb-3">Helpline Numbers</h4>
                <div className="space-y-2">
                  {helplines.map((helpline, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => callHelpline(helpline.number)}
                    >
                      <div>
                        <p className="font-medium text-sm">{helpline.name}</p>
                        <p className="text-xs text-gray-500">{helpline.description}</p>
                      </div>
                      <PhoneIcon className="w-4 h-4 text-primary-500" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Tips */}
              <Card className="bg-primary-50 border border-primary-200">
                <h4 className="font-semibold text-primary-800 mb-2">Before Filing Complaint</h4>
                <ul className="space-y-2 text-sm text-primary-700">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Take screenshots as evidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Save URLs/profile links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Note down dates and times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Don't delete any messages</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}

        {/* Track Complaint Tab */}
        {activeTab === 'track' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Track Your Complaint</h3>

            <div className="flex gap-3 mb-6">
              <Input
                placeholder="Enter Complaint ID (e.g., CYC-123456)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleTrackComplaint}
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Track
              </Button>
            </div>

            {trackedComplaint && (
              <div className="space-y-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Complaint Details</h4>
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      {trackedComplaint.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{complaintTypes.find(t => t.id === trackedComplaint.type)?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium text-success">{trackedComplaint.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Filed on</p>
                      <p className="font-medium">{trackedComplaint.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Platform</p>
                      <p className="font-medium">{trackedComplaint.platform || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Status Updates</h4>
                  <div className="space-y-3">
                    {trackedComplaint.updates?.map((update, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 mt-2 bg-primary-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-gray-600">{update.message}</p>
                          <p className="text-xs text-gray-400">{update.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => copyTrackingId(trackedComplaint.id)}
                >
                  Copy Tracking ID
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openWebsite(resource.url)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
                    {resource.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    <p className="text-xs text-primary-600 mt-2 truncate">{resource.url}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Legal Resources */}
            <Card className="md:col-span-2 bg-primary-50 border border-primary-200">
              <h4 className="font-semibold text-primary-800 mb-3">Legal Provisions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-2">IT Act 2000</p>
                  <ul className="space-y-1 text-primary-700">
                    <li>Section 66C: Identity Theft</li>
                    <li>Section 66E: Privacy Violation</li>
                    <li>Section 67: Obscene Content</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">IPC</p>
                  <ul className="space-y-1 text-primary-700">
                    <li>Section 354D: Stalking</li>
                    <li>Section 499: Defamation</li>
                    <li>Section 503: Criminal Intimidation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Punishment</p>
                  <ul className="space-y-1 text-primary-700">
                    <li>Up to 3 years imprisonment</li>
                    <li>Fine up to ₹5 lakhs</li>
                    <li>Both imprisonment and fine</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* My Complaints Tab */}
        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">My Complaints</h3>

            {complaints.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No complaints filed yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => setActiveTab('report')}
                >
                  File Your First Complaint
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{complaint.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          complaint.status === 'Filed' ? 'bg-primary-100 text-primary-600' :
                          complaint.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{complaint.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{complaint.description.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Type: {complaintTypes.find(t => t.id === complaint.type)?.name}</span>
                      {complaint.platform && <span>• Platform: {complaint.platform}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Safety Tips */}
      <Card className="bg-primary-50 border border-primary-200">
        <h4 className="font-medium text-primary-800 mb-2">Cyber Safety Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-primary-700">
          <div className="flex items-start gap-2">
            <ShieldExclamationIcon className="w-4 h-4 text-primary-600 mt-0.5" />
            <span>Use strong, unique passwords for each account</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldExclamationIcon className="w-4 h-4 text-primary-600 mt-0.5" />
            <span>Enable two-factor authentication</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldExclamationIcon className="w-4 h-4 text-primary-600 mt-0.5" />
            <span>Be careful what you share on social media</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldExclamationIcon className="w-4 h-4 text-primary-600 mt-0.5" />
            <span>Don't click on suspicious links</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CyberCrimePortal;
