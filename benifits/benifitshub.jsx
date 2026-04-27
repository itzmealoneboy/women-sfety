import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import {
  GiftIcon,
  AcademicCapIcon,
  BanknotesIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const BenefitsHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schemes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for government schemes
  const mockSchemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      description: 'Cash incentive for pregnant women and lactating mothers',
      benefit: '₹5,000 in installments',
      eligibility: 'Pregnant women and lactating mothers for first living child',
      deadline: 'Ongoing',
      category: 'health',
      ministry: 'Ministry of Women & Child Development',
      website: 'https://pmmvy.cas.nic.in/',
      applicationProcess: 'Visit Anganwadi center or apply online',
      documents: ['Aadhaar', 'Bank account', 'MCP card'],
      icon: '👶',
      lastUpdated: '2 hours ago',
      tags: ['pregnancy', 'mother', 'health', 'cash benefit'],
      helpline: '1800-123-4567',
      stateSpecific: false,
      applied: false,
      saved: false
    },
    {
      id: 2,
      name: 'Sukanya Samriddhi Yojana',
      description: 'Savings scheme for girl child education and marriage',
      benefit: 'Up to ₹1.5 lakh/year, 8.2% interest rate',
      eligibility: 'Girl child below 10 years',
      deadline: 'Any time',
      category: 'savings',
      ministry: 'Ministry of Finance',
      website: 'https://www.nsiindia.gov.in/',
      applicationProcess: 'Open account in post office or authorized bank',
      documents: ['Birth certificate', 'Aadhaar', 'Guardian\'s ID'],
      icon: '👧',
      lastUpdated: '1 day ago',
      tags: ['girl child', 'savings', 'education', 'marriage'],
      helpline: '1800-111-555',
      stateSpecific: false,
      applied: false,
      saved: true
    },
    {
      id: 3,
      name: 'National Widow Pension Scheme',
      description: 'Monthly pension for widows',
      benefit: '₹1,000 - ₹2,000/month',
      eligibility: 'Widow aged 40-79, BPL category',
      deadline: 'Ongoing',
      category: 'pension',
      ministry: 'Ministry of Social Justice',
      website: 'https://nsap.nic.in/',
      applicationProcess: 'Apply through state social welfare department',
      documents: ['Death certificate of husband', 'BPL certificate', 'Aadhaar'],
      icon: '👵',
      lastUpdated: '5 hours ago',
      tags: ['widow', 'pension', 'elderly', 'BPL'],
      helpline: '1800-180-1500',
      stateSpecific: true,
      states: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh'],
      applied: false,
      saved: false
    },
    {
      id: 4,
      name: 'Pradhan Mantri Ujjwala Yojana',
      description: 'Free LPG connection to women from BPL households',
      benefit: 'Free LPG connection + first cylinder',
      eligibility: 'Women above 18, BPL family',
      deadline: 'Phase 2 ongoing',
      category: 'housing',
      ministry: 'Ministry of Petroleum',
      website: 'https://www.pmujjwalayojana.com/',
      applicationProcess: 'Apply at nearest LPG distributor',
      documents: ['BPL certificate', 'Aadhaar', 'Ration card'],
      icon: '🔥',
      lastUpdated: '3 hours ago',
      tags: ['lpg', 'fuel', 'BPL', 'cooking gas'],
      helpline: '1800-233-3555',
      stateSpecific: false,
      applied: true,
      saved: false
    },
    {
      id: 5,
      name: 'Pradhan Mantri Awas Yojana - Women Component',
      description: 'Housing scheme with women ownership',
      benefit: '₹1.2 - 2.5 lakh subsidy',
      eligibility: 'Women from economically weaker sections',
      deadline: '2025-03-31',
      category: 'housing',
      ministry: 'Ministry of Housing',
      website: 'https://pmaymis.gov.in/',
      applicationProcess: 'Apply online through PMAY portal',
      documents: ['Aadhaar', 'Income certificate', 'Land documents'],
      icon: '🏠',
      lastUpdated: '1 hour ago',
      tags: ['housing', 'home', 'subsidy', 'EWS'],
      helpline: '1800-11-6161',
      stateSpecific: false,
      applied: false,
      saved: true
    },
    {
      id: 6,
      name: 'Mahila Samman Savings Certificate',
      description: 'One-time small savings scheme for women',
      benefit: 'Up to ₹2 lakh, 7.5% interest',
      eligibility: 'Women of any age',
      deadline: '2025-03-31',
      category: 'savings',
      ministry: 'Ministry of Finance',
      website: 'https://www.indiapost.gov.in/',
      applicationProcess: 'Open account in post office',
      documents: ['Aadhaar', 'PAN card'],
      icon: '💰',
      lastUpdated: '30 minutes ago',
      tags: ['savings', 'investment', 'interest'],
      helpline: '1800-266-6868',
      stateSpecific: false,
      applied: false,
      saved: false
    },
    {
      id: 7,
      name: 'Stand-Up India Scheme',
      description: 'Loan for women entrepreneurs',
      benefit: '₹10 lakh - ₹1 crore',
      eligibility: 'Women entrepreneurs, SC/ST',
      deadline: 'Ongoing',
      category: 'business',
      ministry: 'Ministry of Finance',
      website: 'https://www.standupmitra.in/',
      applicationProcess: 'Apply through bank branches',
      documents: ['Business plan', 'Identity proof', 'Caste certificate'],
      icon: '💼',
      lastUpdated: '2 days ago',
      tags: ['business', 'loan', 'entrepreneur', 'SC/ST'],
      helpline: '1800-123-4567',
      stateSpecific: false,
      applied: false,
      saved: false
    },
    {
      id: 8,
      name: 'Nari Shakti Puraskar',
      description: 'National award for women empowerment',
      benefit: 'Recognition and cash prize ₹1-2 lakh',
      eligibility: 'Women achievers and organizations',
      deadline: '2025-12-31',
      category: 'award',
      ministry: 'Ministry of Women & Child Development',
      website: 'https://wcd.nic.in/',
      applicationProcess: 'Nomination through state governments',
      documents: ['Achievement proof', 'Recommendation letters'],
      icon: '🏆',
      lastUpdated: '1 week ago',
      tags: ['award', 'recognition', 'achievement'],
      helpline: '1800-112-345',
      stateSpecific: false,
      applied: false,
      saved: true
    }
  ];

  // Mock scholarships data
  const mockScholarships = [
    {
      id: 1,
      name: 'National Scholarship for Women',
      provider: 'Government of India',
      amount: '₹50,000/year',
      deadline: '2025-03-15',
      level: 'ug',
      category: 'general',
      description: 'Merit-based scholarship for women pursuing higher education',
      eligibility: 'Minimum 60% in previous exam, family income < ₹2 lakh/year',
      website: 'https://scholarships.gov.in',
      icon: '👩‍🎓',
      isNew: true,
      lastUpdated: '2 hours ago',
      tags: ['merit', 'women', 'UG'],
      documents: ['Marksheets', 'Income certificate', 'Aadhaar'],
      applied: false,
      saved: true
    },
    {
      id: 2,
      name: 'STEM Girls Scholarship',
      provider: 'Google',
      amount: '$10,000',
      deadline: '2025-04-30',
      level: 'pg',
      category: 'stem',
      description: 'For women pursuing careers in technology and computer science',
      eligibility: 'Women in STEM fields, demonstrated leadership',
      website: 'https://buildyourfuture.withgoogle.com/scholarships',
      icon: '💻',
      isNew: true,
      lastUpdated: '5 hours ago',
      tags: ['STEM', 'tech', 'Google'],
      documents: ['Resume', 'Essay', 'Recommendation letters'],
      applied: false,
      saved: false
    },
    {
      id: 3,
      name: 'Women in Engineering Scholarship',
      provider: 'SWE',
      amount: '$5,000',
      deadline: '2025-05-15',
      level: 'ug',
      category: 'engineering',
      description: 'Supporting women pursuing engineering degrees',
      eligibility: 'Women enrolled in ABET-accredited engineering programs',
      website: 'https://swe.org/scholarships',
      icon: '⚙️',
      isNew: false,
      lastUpdated: '1 day ago',
      tags: ['engineering', 'SWE', 'STEM'],
      documents: ['Transcript', 'Essay', 'Recommendations'],
      applied: true,
      saved: false
    },
    {
      id: 4,
      name: 'L\'Oréal UNESCO For Women in Science',
      provider: 'UNESCO',
      amount: '₹3,00,000',
      deadline: '2025-06-30',
      level: 'phd',
      category: 'research',
      description: 'International award for women researchers',
      eligibility: 'Women researchers with PhD, under 35 years',
      website: 'https://www.forwomeninscience.com/',
      icon: '🔬',
      isNew: true,
      lastUpdated: '3 hours ago',
      tags: ['research', 'PhD', 'science'],
      documents: ['Research proposal', 'Publications', 'CV'],
      applied: false,
      saved: true
    },
    {
      id: 5,
      name: 'Indira Gandhi Single Girl Child Scholarship',
      provider: 'UGC',
      amount: '₹2,000/month',
      deadline: '2025-07-31',
      level: 'ug,pg',
      category: 'special',
      description: 'For single girl child pursuing higher education',
      eligibility: 'Only girl child of parents, enrolled in recognized institution',
      website: 'https://www.ugc.ac.in/',
      icon: '👧',
      isNew: false,
      lastUpdated: '2 days ago',
      tags: ['single girl', 'UGC', 'monthly'],
      documents: ['Birth certificate', 'Admission proof', 'Income certificate'],
      applied: false,
      saved: false
    },
    {
      id: 6,
      name: 'Prime Minister\'s Scholarship for CAPF',
      provider: 'MHA',
      amount: '₹25,000/year',
      deadline: '2025-06-30',
      level: 'ug,pg',
      category: 'defense',
      description: 'For wards of CAPF and Assam Rifles personnel',
      eligibility: 'Wards of CAPF/Assam Rifles personnel, minimum 60% marks',
      website: 'https://www.mha.gov.in/',
      icon: '👮‍♀️',
      isNew: false,
      lastUpdated: '1 week ago',
      tags: ['defense', 'CAPF', 'wards'],
      documents: ['Service certificate', 'Marksheets', 'ID proof'],
      applied: false,
      saved: false
    }
  ];

  useEffect(() => {
    // Load data
    setSchemes(mockSchemes);
    setScholarships(mockScholarships);
    setFilteredSchemes(mockSchemes);
    setFilteredScholarships(mockScholarships);

    // Load saved items from localStorage
    const saved = localStorage.getItem('savedBenefits');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Filter schemes based on search and category
    let filtered = schemes;

    if (searchQuery) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(scheme =>
        !scheme.stateSpecific || scheme.states?.includes(selectedState)
      );
    }

    setFilteredSchemes(filtered);
  }, [searchQuery, selectedCategory, selectedState, schemes]);

  useEffect(() => {
    // Filter scholarships
    let filtered = scholarships;

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    setFilteredScholarships(filtered);
  }, [searchQuery, selectedCategory, scholarships]);

  const tabs = [
    { id: 'schemes', name: 'Government Schemes', icon: BanknotesIcon, count: schemes.length },
    { id: 'scholarships', name: 'Scholarships', icon: AcademicCapIcon, count: scholarships.length },
    { id: 'saved', name: 'Saved Items', icon: StarIcon, count: savedItems.length }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'health', name: 'Health & Wellness' },
    { id: 'education', name: 'Education' },
    { id: 'savings', name: 'Savings & Investment' },
    { id: 'housing', name: 'Housing' },
    { id: 'business', name: 'Business & Entrepreneurship' },
    { id: 'pension', name: 'Pension' },
    { id: 'award', name: 'Awards & Recognition' }
  ];

  const states = [
    { id: 'all', name: 'All States' },
    { id: 'Tamil Nadu', name: 'Tamil Nadu' },
    { id: 'Kerala', name: 'Kerala' },
    { id: 'Karnataka', name: 'Karnataka' },
    { id: 'Andhra Pradesh', name: 'Andhra Pradesh' },
    { id: 'Telangana', name: 'Telangana' },
    { id: 'Maharashtra', name: 'Maharashtra' },
    { id: 'Delhi', name: 'Delhi' }
  ];

  const saveItem = (item) => {
    const newSaved = [...savedItems, item.id];
    setSavedItems(newSaved);
    localStorage.setItem('savedBenefits', JSON.stringify(newSaved));
    toast.success('Item saved to your list');
  };

  const unsaveItem = (id) => {
    const newSaved = savedItems.filter(itemId => itemId !== id);
    setSavedItems(newSaved);
    localStorage.setItem('savedBenefits', JSON.stringify(newSaved));
    toast.success('Item removed from saved list');
  };

  const applyForScheme = (scheme) => {
    window.open(scheme.website, '_blank');
    toast.success(`Opening application portal for ${scheme.name}`);
  };

  const checkEligibility = (item) => {
    toast.info(`Checking eligibility for ${item.name}`);
    // In real app, open eligibility checker
  };

  const getDaysLeft = (deadline) => {
    if (deadline === 'Ongoing') return 'Ongoing';
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays < 30) return `${diffDays} days left`;
    return `${Math.floor(diffDays / 30)} months left`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🎁 Benefits Hub
          </h1>
          <p className="text-gray-600 mt-1">
            Discover government schemes and scholarships for women
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search benefits..."
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none w-64"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Schemes</p>
              <p className="text-3xl font-bold mt-1">{schemes.length}+</p>
            </div>
            <BanknotesIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Scholarships</p>
              <p className="text-3xl font-bold mt-1">{scholarships.length}+</p>
            </div>
            <AcademicCapIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Women Beneficiaries</p>
              <p className="text-3xl font-bold mt-1">10,000+</p>
            </div>
            <UserGroupIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Savings</p>
              <p className="text-3xl font-bold mt-1">{savedItems.length}</p>
            </div>
            <GiftIcon className="w-12 h-12 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <h3 className="font-semibold mb-4">Filter Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {activeTab === 'schemes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State (for state-specific)
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedState('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

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
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Schemes Tab */}
        {activeTab === 'schemes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                    {scheme.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800">{scheme.name}</h3>
                      <div className="flex gap-1">
                        {scheme.applied && (
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            Applied
                          </span>
                        )}
                        {savedItems.includes(scheme.id) && (
                          <StarIcon className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CurrencyRupeeIcon className="w-3 h-3" />
                        <span>{scheme.benefit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span className={getDaysLeft(scheme.deadline).includes('days') ? 'text-danger' : ''}>
                          {getDaysLeft(scheme.deadline)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 col-span-2">
                        <UserGroupIcon className="w-3 h-3" />
                        <span className="truncate">{scheme.eligibility}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {scheme.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => checkEligibility(scheme)}
                      >
                        Check
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => applyForScheme(scheme)}
                      >
                        Apply
                      </Button>
                      {savedItems.includes(scheme.id) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => unsaveItem(scheme.id)}
                        >
                          <StarIcon className="w-4 h-4 text-warning" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveItem(scheme)}
                        >
                          <StarIcon className="w-4 h-4 text-gray-400" />
                        </Button>
                      )}
                    </div>

                    {/* Last Updated */}
                    <p className="text-xs text-gray-400 mt-3">
                      Updated {scheme.lastUpdated}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScholarships.map((scholarship) => {
              const daysLeft = getDaysLeft(scholarship.deadline);
              
              return (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow relative">
                  {scholarship.isNew && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-success text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                      {scholarship.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-800">{scholarship.name}</h3>
                        <div className="flex gap-1">
                          {scholarship.applied && (
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                              Applied
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <AcademicCapIcon className="w-4 h-4" />
                        {scholarship.provider}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CurrencyRupeeIcon className="w-3 h-3" />
                          <span>{scholarship.amount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarIcon className="w-3 h-3" />
                          <span className={daysLeft.includes('days') ? 'text-danger' : ''}>
                            {daysLeft}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 col-span-2">
                          <UserGroupIcon className="w-3 h-3" />
                          <span className="truncate">{scholarship.eligibility}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded">
                          {scholarship.level}
                        </span>
                        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded">
                          {scholarship.category}
                        </span>
                        {scholarship.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => checkEligibility(scholarship)}
                        >
                          Check
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(scholarship.website, '_blank')}
                        >
                          Apply
                        </Button>
                        {savedItems.includes(scholarship.id) ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unsaveItem(scholarship.id)}
                          >
                            <StarIcon className="w-4 h-4 text-warning" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveItem(scholarship)}
                          >
                            <StarIcon className="w-4 h-4 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Saved Items Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedItems.length === 0 ? (
              <Card className="text-center py-12">
                <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved items</h3>
                <p className="text-gray-500 mb-4">Save schemes and scholarships to access them later</p>
                <Button
                  variant="primary"
                  onClick={() => setActiveTab('schemes')}
                >
                  Browse Schemes
                </Button>
              </Card>
            ) : (
              <>
                {/* Show saved schemes */}
                {schemes.filter(s => savedItems.includes(s.id)).map(scheme => (
                  <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                        {scheme.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-800">{scheme.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unsaveItem(scheme.id)}
                          >
                            <StarIcon className="w-4 h-4 text-warning" />
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => applyForScheme(scheme)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Show saved scholarships */}
                {scholarships.filter(s => savedItems.includes(s.id)).map(scholarship => (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                        {scholarship.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-800">{scholarship.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unsaveItem(scholarship.id)}
                          >
                            <StarIcon className="w-4 h-4 text-warning" />
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">{scholarship.description}</p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => window.open(scholarship.website, '_blank')}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-primary-50 border border-primary-200">
        <div className="flex items-start gap-3">
          <SparklesIcon className="w-5 h-5 text-primary-600 mt-1" />
          <div>
            <h4 className="font-semibold text-primary-800 mb-1">Real-time Updates</h4>
            <p className="text-sm text-primary-700">
              Scheme and scholarship data is updated regularly from official government sources. 
              Deadlines and amounts are verified daily.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BenefitsHub;
