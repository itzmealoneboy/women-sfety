import { useState, useEffect } from 'react'
import { useEmergencyStore } from '../../store/emergencystore'
import { useLocationStore } from '../../store/locationsstore'
import { AiAutoWitnessCard } from '../../components/sakshieye/SakshiEyeComponents'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import { 
  PhoneIcon,
  UserPlusIcon,
  TrashIcon,
  MapPinIcon,
  ShieldCheckIcon,
  FireIcon,
  TruckIcon,
  HeartIcon,
  ComputerDesktopIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const EmergencyHub = () => {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact, loadEmergencyContacts } = useEmergencyStore()
  const { currentLocation } = useLocationStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadEmergencyContacts()
  }, [])

  const helplines = [
    { name: 'Police', number: '100', icon: ShieldCheckIcon, color: 'bg-danger' },
    { name: 'Ambulance', number: '108', icon: TruckIcon, color: 'bg-success' },
    { name: 'Women Helpline', number: '1091', icon: HeartIcon, color: 'bg-warning' },
    { name: 'Fire', number: '101', icon: FireIcon, color: 'bg-orange-500' },
    { name: 'Cyber Crime', number: '1930', icon: ComputerDesktopIcon, color: 'bg-primary-500' },
    { name: 'Legal Aid', number: '15100', icon: ScaleIcon, color: 'bg-secondary-500' }
  ]

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill all fields')
      return
    }

    if (!/^\d{10}$/.test(newContact.phone)) {
      toast.error('Please enter valid 10-digit phone number')
      return
    }

    setLoading(true)
    const result = await addEmergencyContact(newContact)
    
    if (result.success) {
      toast.success('Emergency contact added')
      setShowAddModal(false)
      setNewContact({ name: '', phone: '', relation: '' })
    } else {
      toast.error(result.error)
    }
    
    setLoading(false)
  }

  const handleRemoveContact = async (contactId) => {
    if (confirm('Remove this emergency contact?')) {
      const result = await removeEmergencyContact(contactId)
      if (result.success) {
        toast.success('Contact removed')
      } else {
        toast.error(result.error)
      }
    }
  }

  const callNumber = (number) => {
    window.location.href = `tel:${number}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          🚨 Emergency Hub
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Emergency Numbers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {helplines.map((helpline) => (
          <Card
            key={helpline.number}
            className="text-center cursor-pointer hover:-translate-y-1 transition-all"
            onClick={() => callNumber(helpline.number)}
          >
            <div className={`w-12 h-12 ${helpline.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
              <helpline.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-sm">{helpline.name}</h3>
            <p className="text-lg font-bold text-primary-600">{helpline.number}</p>
            <p className="text-xs text-gray-500 mt-2">Tap to call</p>
          </Card>
        ))}
      </div>

      {/* AI Auto Witness Card */}
      <AiAutoWitnessCard
        isMonitoring={true}
        cameraActive={true}
        micActive={true}
        lastDetection="5 min ago"
      />

      {/* Current Location */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-danger" />
          Your Current Location
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-mono text-sm">
            {currentLocation.lat.toFixed(6)}°N, {currentLocation.lng.toFixed(6)}°E
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
              )
              toast.success('Location copied to clipboard')
            }}
          >
            Copy Location
          </Button>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">My Emergency Contacts</h3>
        
        {emergencyContacts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <UserPlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No emergency contacts added</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowAddModal(true)}
            >
              Add Your First Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <p className="text-xs text-gray-500">{contact.relation || 'Contact'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => callNumber(contact.phone)}
                  >
                    <PhoneIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Emergency Contact"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="Enter contact name"
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            placeholder="10-digit phone number"
            pattern="[0-9]{10}"
          />
          
          <Input
            label="Relation (Optional)"
            value={newContact.relation}
            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
            placeholder="e.g., Mother, Sister, Friend"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddContact}
              loading={loading}
            >
              Add Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EmergencyHub

