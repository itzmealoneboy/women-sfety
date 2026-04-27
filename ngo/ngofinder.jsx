import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../../store/locationsstore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Map from '../../components/common/Map';
import {
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  ScaleIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const NGOFinder = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocationStore();
  
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('10');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All NGOs', icon: HeartIcon },
    { id: 'women', name: 'Women Rights', icon: UserGroupIcon },
    { id: 'legal', name: 'Legal Aid', icon: ScaleIcon },
    { id: 'education', name: 'Education', icon: AcademicCapIcon },
    { id: 'health', name: 'Health', icon: HeartIcon },
    { id: 'shelter', name: 'Shelter', icon: BuildingLibraryIcon },
    { id: 'livelihood', name: 'Livelihood', icon: BriefcaseIcon },
    { id: 'counseling', name: 'Counseling', icon: HeartIcon }
  ];

  // Mock NGO data
  const mockNgos = [
    {
      id: 1,
      name: 'Sakhi Women Support Center',
      category: 'women',
      description: 'Providing support, counseling, and legal aid to women in distress',
      address: '123 Gandhi Street, T Nagar, Chennai - 600017',
      location: { lat: 13.0827, lng: 80.2707 },
      phone: '044-12345678',
      email: 'support@sakhi.org',
      website: 'https://sakhi.org',
      services: ['Counseling', 'Legal Aid', 'Shelter', 'Helpline'],
      hours: '24/7 Helpline, Office: 9 AM - 6 PM',
      rating: 4.8,
      reviews: 234,
      established: '1995',
      accreditation: ['ISO 9001', 'NITI Aayog'],
      distance: 1.2,
      verified: true
    },
    {
      id: 2,
      name: 'Legal Rights Forum',
      category: 'legal',
      description: 'Free legal aid and awareness programs for women',
      address: '45 Justice Avenue, Anna Nagar, Chennai - 600040',
      location: { lat: 13.0857, lng: 80.2157 },
      phone: '044-87654321',
      email: 'help@legalrights.org',
      website: 'https://legalrights.org',
      services: ['Legal Consultation', 'Court Representation', 'Awareness Camps', 'Documentation'],
      hours: 'Mon-Sat: 10 AM - 5 PM',
      rating: 4.7,
      reviews: 156,
      established: '2000',
      accreditation: ['Bar Council', 'NALSA'],
      distance: 2.5,
      verified: true
    },
    {
      id: 3,
      name: 'Empower Women Foundation',
      category: 'women',
      description: 'Empowering women through education and skill development',
      address: '78 Education Road, Velachery, Chennai - 600042',
      location: { lat: 12.9784, lng: 80.2208 },
      phone: '044-98765432',
      email: 'info@empower.org',
      website: 'https://empower.org',
      services: ['Skill Training', 'Education Support', 'Job Placement', 'Microfinance'],
      hours: 'Mon-Fri: 9 AM - 6 PM, Sat: 9 AM - 1 PM',
      rating: 4.9,
      reviews: 312,
      established: '2005',
      accreditation: ['MSJE', 'NCW'],
      distance: 3.8,
      verified: true
    },
    {
      id: 4,
      name: 'Shelter Home for Women',
      category: 'shelter',
      description: 'Safe shelter and rehabilitation for women in crisis',
      address: '234 Safety Street, Adyar, Chennai - 600020',
      location: { lat: 13.0067, lng: 80.2576 },
      phone: '044-45678901',
      email: 'contact@shelterhome.org',
      website: 'https://shelterhome.org',
      services: ['Emergency Shelter', 'Food', 'Medical Care', 'Counseling'],
      hours: '24/7 Emergency',
      rating: 4.6,
      reviews: 89,
      established: '2010',
      accreditation: ['Social Welfare Dept', 'NITI Aayog'],
      distance: 4.1,
      verified: true
    },
    {
      id: 5,
      name: 'HealthFirst Women\'s Clinic',
      category: 'health',
      description: 'Affordable healthcare services for women',
      address: '567 Health Avenue, Mylapore, Chennai - 600004',
      location: { lat: 13.0358, lng: 80.2676 },
      phone: '044-56789012',
      email: 'care@healthfirst.org',
      website: 'https://healthfirst.org',
      services: ['General Health', 'Mental Health', 'Reproductive Health', 'Health Camps'],
      hours: 'Mon-Sat: 8 AM - 8 PM, Sun: 9 AM - 1 PM',
      rating: 4.5,
      reviews: 178,
      established: '2015',
      accreditation: ['Medical Council', 'Health Dept'],
      distance: 2.9,
      verified: true
    },
    {
      id: 6,
      name: 'Education for All',
      category: 'education',
      description: 'Promoting education among underprivileged girls',
      address: '890 Learning Street, Egmore, Chennai - 600008',
      location: { lat: 13.0748, lng: 80.2624 },
      phone: '044-67890123',
      email: 'info@educationforall.org',
      website: 'https://educationforall.org',
      services: ['Scholarships', 'Tuition', 'School Supplies', 'Mentoring'],
      hours: 'Mon-Fri: 10 AM - 6 PM, Sat: 10 AM - 2 PM',
      rating: 4.8,
      reviews: 201,
      established: '2008',
      accreditation: ['Education Dept', 'NGO Darpan'],
      distance: 1.8,
      verified: true
    },
    {
      id: 7,
      name: 'Women Entrepreneurship Hub',
      category: 'livelihood',
      description: 'Supporting women entrepreneurs and self-help groups',
      address: '321 Business Park, Kodambakkam, Chennai - 600024',
      location: { lat: 13.0548, lng: 80.2316 },
      phone: '044-78901234',
      email: 'support@womenentrepreneurs.org',
      website: 'https://womenentrepreneurs.org',
      services: ['Business Training', 'Loan Support', 'Market Linkage', 'Mentorship'],
      hours: 'Mon-Fri: 9 AM - 7 PM',
      rating: 4.7,
      reviews: 145,
      established: '2018',
      accreditation: ['MSME', 'Startup India'],
      distance: 3.2,
      verified: true
    },
    {
      id: 8,
      name: 'Counseling and Wellness Center',
      category: 'counseling',
      description: 'Free counseling services for women in distress',
      address: '456 Wellness Road, Nungambakkam, Chennai - 600034',
      location: { lat: 13.0628, lng: 80.2426 },
      phone: '044-89012345',
      email: 'counsel@wellness.org',
      website: 'https://wellness.org',
      services: ['Individual Counseling', 'Group Therapy', 'Crisis Intervention', 'Helpline'],
      hours: 'Mon-Sat: 9 AM - 9 PM',
      rating: 4.9,
      reviews: 267,
      established: '2012',
      accreditation: ['Mental Health Council', 'ICSW'],
      distance: 2.3,
      verified: true
    }
  ];

  useEffect(() => {
    loadNGOs();
  }, []);

  useEffect(() => {
    filterNGOs();
  }, [searchQuery, selectedCategory, selectedDistance, ngos]);

  const loadNGOs = () => {
    setLoading(true);
    setTimeout(() => {
      setNgos(mockNgos);
      setFilteredNgos(mockNgos);
      setLoading(false);
    }, 1000);
  };

  const filterNGOs = () => {
    let filtered = ngos;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ngo =>
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ngo => ngo.category === selectedCategory);
    }

    // Distance filter
    if (selectedDistance !== 'all') {
      const maxDistance = parseFloat(selectedDistance);
      filtered = filtered.filter(ngo => ngo.distance <= maxDistance);
    }

    setFilteredNgos(filtered);
  };

  const toggleFavorite = (ngoId) => {
    if (favorites.includes(ngoId)) {
      setFavorites(favorites.filter(id => id !== ngoId));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, ngoId]);
      toast.success('Added to favorites');
    }
  };

  const callNGO = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const emailNGO = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const visitWebsite = (website) => {
    window.open(website, '_blank');
  };

  const getDirections = (location) => {
    window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank');
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || HeartIcon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      women: 'text-pink-600 bg-pink-100',
      legal: 'text-purple-600 bg-purple-100',
      education: 'text-blue-600 bg-blue-100',
      health: 'text-green-600 bg-green-100',
      shelter: 'text-orange-600 bg-orange-100',
      livelihood: 'text-yellow-600 bg-yellow-100',
      counseling: 'text-indigo-600 bg-indigo-100'
    };
    return colors[category] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          🤝 NGO Finder
        </h1>
        <p className="text-gray-600 mt-1">
          Find verified NGOs providing support services for women
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, description, or services..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
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

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <h3 className="font-semibold mb-4">Filter NGOs</h3>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <select
                value={selectedDistance}
                onChange={(e) => setSelectedDistance(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
                <option value="all">Any distance</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDistance('10');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Map View */}
      <Card className="p-2">
        <Map
          center={currentLocation || { lat: 13.0827, lng: 80.2707 }}
          zoom={12}
          height="300px"
          markers={[
            {
              lat: currentLocation?.lat || 13.0827,
              lng: currentLocation?.lng || 80.2707,
              popup: 'Your Location',
              icon: L.divIcon({
                html: '<i class="fas fa-user-circle text-success" style="font-size: 30px;"></i>',
                iconSize: [30, 30]
              })
            },
            ...filteredNgos.map(ngo => ({
              lat: ngo.location.lat,
              lng: ngo.location.lng,
              popup: ngo.name,
              icon: L.divIcon({
                html: `<i class="fas fa-heart" style="color: ${
                  ngo.category === 'women' ? '#e83e8c' :
                  ngo.category === 'legal' ? '#6f42c1' :
                  ngo.category === 'education' ? '#007bff' :
                  ngo.category === 'health' ? '#28a745' :
                  ngo.category === 'shelter' ? '#fd7e14' :
                  '#6c757d'
                }; font-size: 24px;"></i>`,
                iconSize: [24, 24]
              })
            }))
          ]}
        />
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Found {filteredNgos.length} NGOs
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadNGOs}
          loading={loading}
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* NGOs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading NGOs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNgos.map((ngo) => {
            const Icon = getCategoryIcon(ngo.category);
            const colorClass = getCategoryColor(ngo.category);

            return (
              <Card
                key={ngo.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedNgo(ngo)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{ngo.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{ngo.category}</span>
                          {ngo.verified && (
                            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(ngo.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        {favorites.includes(ngo.id) ? (
                          <StarIconSolid className="w-5 h-5 text-warning" />
                        ) : (
                          <StarIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ngo.description}</p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {ngo.distance} km
                      </span>
                      <span className="flex items-center gap-1">
                        <StarIconSolid className="w-3 h-3 text-warning" />
                        {ngo.rating} ({ngo.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Est. {ngo.established}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {ngo.services.slice(0, 3).map((service, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {ngo.services.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{ngo.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* NGO Details Modal */}
      {selectedNgo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedNgo.name}</h3>
              <button
                onClick={() => setSelectedNgo(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getCategoryColor(selectedNgo.category)}`}>
                {selectedNgo.category}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-gray-600">{selectedNgo.description}</p>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-semibold mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNgo.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-sm bg-primary-100 text-primary-600 px-3 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span>{selectedNgo.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <PhoneIcon className="w-4 h-4 text-gray-500" />
                    <span>{selectedNgo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                    <span>{selectedNgo.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                    <span>{selectedNgo.website}</span>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h4 className="font-semibold mb-2">Hours</h4>
                <p className="text-sm text-gray-600">{selectedNgo.hours}</p>
              </div>

              {/* Accreditation */}
              {selectedNgo.accreditation && (
                <div>
                  <h4 className="font-semibold mb-2">Accreditation</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNgo.accreditation.map((acc, index) => (
                      <span
                        key={index}
                        className="text-xs bg-success/10 text-success px-2 py-1 rounded-full"
                      >
                        ✓ {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={() => callNGO(selectedNgo.phone)}
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Call
                </Button>
                <Button
                  variant="success"
                  onClick={() => emailNGO(selectedNgo.email)}
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => visitWebsite(selectedNgo.website)}
                >
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  Website
                </Button>
                <Button
                  variant="outline"
                  onClick={() => getDirections(selectedNgo.location)}
                >
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NGOFinder;

