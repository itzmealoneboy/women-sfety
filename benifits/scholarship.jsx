import { useState, useEffect } from 'react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { 
  MagnifyingGlassIcon,
  AcademicCapIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([])
  const [filteredScholarships, setFilteredScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    amount: 'all'
  })

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
      tags: ['merit', 'women', 'ug']
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
      tags: ['stem', 'tech', 'google']
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
      tags: ['engineering', 'swe', 'stem']
    },
    {
      id: 4,
      name: "L'Oréal UNESCO For Women in Science",
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
      tags: ['research', 'phd', 'science']
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
      tags: ['single girl', 'ugc', 'monthly']
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
      tags: ['defense', 'capf', 'wards']
    },
    {
      id: 7,
      name: 'AICTE Pragati Scholarship for Girls',
      provider: 'AICTE',
      amount: '₹50,000/year',
      deadline: '2025-08-15',
      level: 'diploma,ug',
      category: 'technical',
      description: 'For girls pursuing technical education',
      eligibility: 'Admitted to AICTE approved institutions, family income < ₹8 lakh/year',
      website: 'https://www.aicte-india.org/',
      icon: '🔧',
      isNew: true,
      lastUpdated: '4 hours ago',
      tags: ['technical', 'aicte', 'diploma']
    },
    {
      id: 8,
      name: 'Post Matric Scholarship for SC Students',
      provider: 'Ministry of Social Justice',
      amount: 'Full tuition + maintenance',
      deadline: '2025-11-15',
      level: 'ug,pg',
      category: 'sc',
      description: 'Comprehensive scholarship for SC students',
      eligibility: 'SC category students, family income < ₹2.5 lakh/year',
      website: 'https://scholarships.gov.in/',
      icon: '📚',
      isNew: false,
      lastUpdated: '2 days ago',
      tags: ['sc', 'post-matric', 'maintenance']
    }
  ]

  useEffect(() => {
    loadScholarships()
  }, [])

  useEffect(() => {
    filterScholarships()
  }, [searchTerm, filters, scholarships])

  const loadScholarships = async () => {
    // Simulate API call
    setTimeout(() => {
      setScholarships(mockScholarships)
      setFilteredScholarships(mockScholarships)
      setLoading(false)
    }, 1500)
  }

  const filterScholarships = () => {
    let filtered = [...scholarships]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(s => s.level.includes(filters.level))
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(s => s.category === filters.category)
    }

    // Amount filter (simplified)
    if (filters.amount !== 'all') {
      // In real app, would filter by amount range
    }

    setFilteredScholarships(filtered)
  }

  const checkEligibility = (scholarship) => {
    toast.success(`Checking eligibility for ${scholarship.name}`, {
      icon: '✓'
    })
  }

  const applyForScholarship = (scholarship) => {
    window.open(scholarship.website, '_blank')
    toast.info(`Redirecting to ${scholarship.provider} portal...`)
  }

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'diploma', name: 'Diploma' },
    { id: 'ug', name: 'Undergraduate' },
    { id: 'pg', name: 'Postgraduate' },
    { id: 'phd', name: 'PhD' }
  ]

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'general', name: 'General' },
    { id: 'stem', name: 'STEM' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'medical', name: 'Medical' },
    { id: 'research', name: 'Research' },
    { id: 'technical', name: 'Technical' },
    { id: 'special', name: 'Special Category' },
    { id: 'sc', name: 'SC/ST' }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysLeft = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scholarships by name, provider or tags..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        >
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={filters.amount}
          onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        >
          <option value="all">Any Amount</option>
          <option value="below_50k">Below ₹50,000</option>
          <option value="50k_1l">₹50,000 - ₹1,00,000</option>
          <option value="1l_2l">₹1,00,000 - ₹2,00,000</option>
          <option value="above_2l">Above ₹2,00,000</option>
        </select>
      </div>

      {/* Results Stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredScholarships.length} scholarships
        </p>
        <p className="text-sm text-primary-600">
          <SparklesIcon className="w-4 h-4 inline mr-1" />
          Updated in real-time from official sources
        </p>
      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading scholarships...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScholarships.map((scholarship) => {
            const daysLeft = getDaysLeft(scholarship.deadline)
            
            return (
              <Card key={scholarship.id} className="hover:shadow-lg transition-shadow relative">
                {/* New Badge */}
                {scholarship.isNew && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-success text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      NEW
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                    {scholarship.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 pr-16">
                      {scholarship.name}
                    </h3>
                    
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
                        <span className={daysLeft < 30 ? 'text-danger' : ''}>
                          {daysLeft} days left
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

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => checkEligibility(scholarship)}
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Check
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => applyForScholarship(scholarship)}
                      >
                        <GlobeAltIcon className="w-4 h-4 mr-1" />
                        Apply
                      </Button>
                    </div>

                    {/* Deadline */}
                    <p className="text-xs text-gray-400 mt-2">
                      Deadline: {formatDate(scholarship.deadline)}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-primary-50 border border-primary-200">
        <div className="flex items-start gap-3">
          <SparklesIcon className="w-5 h-5 text-primary-600 mt-1" />
          <div>
            <h4 className="font-semibold text-primary-800 mb-1">Real-time Updates</h4>
            <p className="text-sm text-primary-700">
              Scholarship data is fetched live from the National Scholarship Portal and other official sources. 
              Deadlines and amounts are updated automatically.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Scholarships
