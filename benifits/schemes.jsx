import { useState, useEffect } from 'react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Schemes = () => {
  const [schemes, setSchemes] = useState([])
  const [filteredSchemes, setFilteredSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    income: 'all',
    age: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Mock schemes data
  const mockSchemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Matru Vandana Yojana',
      description: 'Cash incentive for pregnant women and lactating mothers',
      benefit: '₹5,000',
      eligibility: 'Pregnant women, first living child',
      deadline: 'Ongoing',
      category: 'health',
      ministry: 'Ministry of Women & Child Development',
      icon: '👶',
      website: 'https://pmmvy.cas.nic.in/',
      lastUpdated: '2 hours ago',
      tags: ['pregnancy', 'mother', 'health']
    },
    {
      id: 2,
      name: 'Sukanya Samriddhi Yojana',
      description: 'Savings scheme for girl child education and marriage',
      benefit: 'Up to ₹1.5 lakh/year, 8.2% interest',
      eligibility: 'Girl child below 10 years',
      deadline: 'Any time',
      category: 'education',
      ministry: 'Ministry of Finance',
      icon: '👧',
      website: 'https://www.nsiindia.gov.in/',
      lastUpdated: '1 day ago',
      tags: ['girl child', 'savings', 'education']
    },
    {
      id: 3,
      name: 'National Widow Pension Scheme',
      description: 'Monthly pension for widows',
      benefit: '₹1,000 - ₹2,000/month',
      eligibility: 'Widow aged 40-79, BPL',
      deadline: 'Ongoing',
      category: 'pension',
      ministry: 'Ministry of Social Justice',
      icon: '👵',
      website: 'https://nsap.nic.in/',
      lastUpdated: '5 hours ago',
      tags: ['widow', 'pension', 'elderly']
    },
    {
      id: 4,
      name: 'Ujjwala Yojana',
      description: 'Free LPG connection to women from BPL households',
      benefit: 'Free LPG connection + first cylinder',
      eligibility: 'Women above 18, BPL family',
      deadline: 'Phase 2 ongoing',
      category: 'housing',
      ministry: 'Ministry of Petroleum',
      icon: '🔥',
      website: 'https://www.pmujjwalayojana.com/',
      lastUpdated: '3 hours ago',
      tags: ['lpg', 'fuel', 'bpl']
    },
    {
      id: 5,
      name: 'PM Awas Yojana - Women Component',
      description: 'Housing scheme with women ownership',
      benefit: '₹1.2 - 2.5 lakh subsidy',
      eligibility: 'Women from economically weaker sections',
      deadline: '2025-03-31',
      category: 'housing',
      ministry: 'Ministry of Housing',
      icon: '🏠',
      website: 'https://pmaymis.gov.in/',
      lastUpdated: '1 hour ago',
      tags: ['housing', 'home', 'subsidy']
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
      icon: '💰',
      website: 'https://www.indiapost.gov.in/',
      lastUpdated: '30 minutes ago',
      tags: ['savings', 'investment', 'interest']
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
      icon: '💼',
      website: 'https://www.standupmitra.in/',
      lastUpdated: '2 days ago',
      tags: ['business', 'loan', 'entrepreneur']
    },
    {
      id: 8,
      name: 'Nari Shakti Puraskar',
      description: 'National award for women empowerment',
      benefit: 'Recognition and cash prize',
      eligibility: 'Women achievers',
      deadline: '2025-12-31',
      category: 'award',
      ministry: 'Ministry of Women & Child Development',
      icon: '🏆',
      website: 'https://wcd.nic.in/',
      lastUpdated: '1 week ago',
      tags: ['award', 'recognition', 'achievement']
    }
  ]

  useEffect(() => {
    loadSchemes()
  }, [])

  useEffect(() => {
    filterSchemes()
  }, [searchTerm, filters, schemes])

  const loadSchemes = async () => {
    // Simulate API call
    setTimeout(() => {
      setSchemes(mockSchemes)
      setFilteredSchemes(mockSchemes)
      setLoading(false)
    }, 1500)
  }

  const filterSchemes = () => {
    let filtered = [...schemes]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === filters.category)
    }

    // Income filter (simplified)
    if (filters.income !== 'all') {
      // In real app, would check against income slabs
    }

    setFilteredSchemes(filtered)
  }

  const checkEligibility = (scheme) => {
    toast.success(`Checking eligibility for ${scheme.name}`, {
      icon: '✓'
    })
    // In real app, would open eligibility checker
  }

  const applyForScheme = (scheme) => {
    window.open(scheme.website, '_blank')
    toast.info(`Redirecting to ${scheme.ministry} portal...`)
  }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'health', name: 'Health' },
    { id: 'education', name: 'Education' },
    { id: 'pension', name: 'Pension' },
    { id: 'housing', name: 'Housing' },
    { id: 'savings', name: 'Savings' },
    { id: 'business', name: 'Business' },
    { id: 'award', name: 'Awards' }
  ]

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search schemes by name, description or tags..."
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
          <h3 className="font-semibold mb-4">Filter Schemes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Income Slab
              </label>
              <select
                value={filters.income}
                onChange={(e) => setFilters({ ...filters, income: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="all">All Income</option>
                <option value="bpl">Below Poverty Line</option>
                <option value="lIG">Lower Income Group</option>
                <option value="mIG">Middle Income Group</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (Optional)
              </label>
              <Input
                type="number"
                placeholder="Enter age"
                value={filters.age}
                onChange={(e) => setFilters({ ...filters, age: e.target.value })}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        Showing {filteredSchemes.length} schemes
      </p>

      {/* Schemes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading schemes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                  {scheme.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{scheme.name}</h3>
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      {scheme.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CurrencyRupeeIcon className="w-3 h-3" />
                      <span>{scheme.benefit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{scheme.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 col-span-2">
                      <UserIcon className="w-3 h-3" />
                      <span className="truncate">{scheme.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 col-span-2">
                      <BuildingOfficeIcon className="w-3 h-3" />
                      <span className="truncate">{scheme.ministry}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {scheme.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => checkEligibility(scheme)}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Check
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => applyForScheme(scheme)}
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                      Apply
                    </Button>
                  </div>

                  {/* Last Updated */}
                  <p className="text-xs text-gray-400 mt-2">
                    Updated {scheme.lastUpdated}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Schemes
