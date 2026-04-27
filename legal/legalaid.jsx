import { useState } from 'react'
import { useAuthStore } from '../../store/authstores'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebases'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Map from '../../components/common/Map'
import { useLocationStore } from '../../store/locationsstore'
import { 
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const LegalAid = () => {
  const { user } = useAuthStore()
  const { currentLocation } = useLocationStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    district: '',
    caseType: '',
    description: '',
    income: ''
  })

  const caseTypes = [
    'Domestic Violence',
    'Property Dispute',
    'Divorce/Maintenance',
    'Sexual Harassment',
    'Dowry Harassment',
    'Child Custody',
    'Cybercrime',
    'Workplace Harassment'
  ]

  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
    'Tirunelveli', 'Vellore', 'Erode', 'Thoothukkudi', 'Kanyakumari'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.caseType || !formData.description) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, 'legalAidApplications'), {
        ...formData,
        userId: user?.uid,
        location: currentLocation,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      })

      toast.success('Legal aid application submitted successfully!')
      setFormData({
        ...formData,
        district: '',
        caseType: '',
        description: '',
        income: ''
      })
    } catch (error) {
      toast.error('Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  // Mock legal aid centers
  const legalCenters = [
    {
      name: 'DLSA Chennai',
      lat: currentLocation.lat + 0.01,
      lng: currentLocation.lng - 0.01,
      address: 'High Court Campus, Chennai',
      phone: '15100'
    },
    {
      name: 'Legal Aid Clinic',
      lat: currentLocation.lat - 0.008,
      lng: currentLocation.lng + 0.008,
      address: 'District Court Complex',
      phone: '044-12345678'
    },
    {
      name: 'Para Legal Volunteer Center',
      lat: currentLocation.lat + 0.005,
      lng: currentLocation.lng + 0.005,
      address: 'Near Your Location',
      phone: '9876543210'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Form */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-primary-500" />
            Apply for Free Legal Aid
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<UserIcon className="w-5 h-5" />}
                required
              />
              
              <Input
                label="Phone Number *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={<PhoneIcon className="w-5 h-5" />}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<EnvelopeIcon className="w-5 h-5" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Type *
                </label>
                <select
                  value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  required
                >
                  <option value="">Select Case Type</option>
                  {caseTypes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (₹)
              </label>
              <select
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="">Select Income Slab</option>
                <option value="below_1lac">Below ₹1,00,000</option>
                <option value="1_2lac">₹1,00,000 - ₹2,00,000</option>
                <option value="2_3lac">₹2,00,000 - ₹3,00,000</option>
                <option value="above_3lac">Above ₹3,00,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="Describe your case in detail..."
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="consent"
                className="w-4 h-4 text-primary-600 rounded"
                required
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I confirm that my annual income is less than ₹3,00,000 (eligible for free legal aid)
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Submit Application
            </Button>
          </form>
        </Card>

        {/* Legal Aid Centers Map */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-primary-500" />
              Legal Aid Centers Near You
            </h3>
            
            <Map
              center={currentLocation}
              markers={[
                {
                  lat: currentLocation.lat,
                  lng: currentLocation.lng,
                  popup: 'You are here',
                  icon: L.divIcon({
                    html: '<i class="fas fa-user-circle text-success" style="font-size: 30px;"></i>',
                    iconSize: [30, 30]
                  })
                },
                ...legalCenters.map(center => ({
                  lat: center.lat,
                  lng: center.lng,
                  popup: `
                    <strong>${center.name}</strong><br>
                    ${center.address}<br>
                    📞 ${center.phone}
                  `,
                  icon: L.divIcon({
                    html: '<i class="fas fa-gavel text-primary-500" style="font-size: 24px;"></i>',
                    iconSize: [24, 24]
                  })
                }))
              ]}
              height="300px"
            />

            <div className="mt-4 space-y-2">
              {legalCenters.map((center, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <ScaleIcon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{center.name}</p>
                    <p className="text-xs text-gray-500">{center.address}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `tel:${center.phone}`}
                  >
                    <PhoneIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Eligibility Info */}
          <Card className="bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Eligibility for Free Legal Aid</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Women and children</li>
              <li>• SC/ST communities</li>
              <li>• Victims of trafficking</li>
              <li>• Annual income less than ₹3,00,000</li>
              <li>• Persons with disabilities</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LegalAid






