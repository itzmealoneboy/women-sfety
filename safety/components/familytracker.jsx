import { useState, useEffect } from 'react'
import L from 'leaflet'
import { useAuthStore } from '../../../store/authstores'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { ref, onValue, off, set } from 'firebase/database'
import { db, rtdb } from '../../../config/firebases'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Map from '../../../components/common/Map'
import { 
  UserPlusIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  ArrowPathIcon,
  WifiIcon,
  Battery100Icon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const FamilyTracker = () => {
  const { user } = useAuthStore()
  const [familyMembers, setFamilyMembers] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', phone: '', relation: '' })
  const [loading, setLoading] = useState(false)
  const [locations, setLocations] = useState({})

  useEffect(() => {
    loadFamilyMembers()
    
    // Subscribe to real-time locations
    const locationsRef = ref(rtdb, 'locations')
    onValue(locationsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setLocations(data)
      }
    })

    return () => off(locationsRef)
  }, [])

  const loadFamilyMembers = async () => {
    try {
      const q = query(collection(db, 'familyMembers'), where('userId', '==', user?.uid))
      const querySnapshot = await getDocs(q)
      const members = []
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() })
      })
      setFamilyMembers(members)
    } catch (error) {
      toast.error('Failed to load family members')
    }
  }

  const addFamilyMember = async () => {
    if (!newMember.name || !newMember.phone) {
      toast.error('Please fill all fields')
      return
    }

    if (!/^\d{10}$/.test(newMember.phone)) {
      toast.error('Please enter valid 10-digit phone number')
      return
    }

    setLoading(true)

    try {
      const docRef = await addDoc(collection(db, 'familyMembers'), {
        ...newMember,
        userId: user?.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      })

      setFamilyMembers([...familyMembers, { id: docRef.id, ...newMember, status: 'pending' }])
      setShowAddForm(false)
      setNewMember({ name: '', phone: '', relation: '' })
      
      toast.success('Family member added! Invitation sent.')
    } catch (error) {
      toast.error('Failed to add family member')
    } finally {
      setLoading(false)
    }
  }

  const removeFamilyMember = async (memberId) => {
    if (!confirm('Remove this family member?')) return

    try {
      await updateDoc(doc(db, 'familyMembers', memberId), { active: false })
      setFamilyMembers(familyMembers.filter(m => m.id !== memberId))
      toast.success('Family member removed')
    } catch (error) {
      toast.error('Failed to remove family member')
    }
  }

  const requestLocation = (memberId) => {
    const member = familyMembers.find(m => m.id === memberId)
    if (!member) return

    // Send location request via notification
    const notificationRef = ref(rtdb, `notifications/${member.phone}`)
    set(notificationRef, {
      type: 'location_request',
      from: user?.name,
      timestamp: Date.now()
    })

    toast.success(`Location request sent to ${member.name}`)
  }

  const messageMember = (memberId) => {
    const member = familyMembers.find(m => m.id === memberId)
    if (!member) return

    const message = prompt(`Message to ${member.name}:`, "I'm safe. How are you?")
    if (message) {
      // Send message via notifications
      const messageRef = ref(rtdb, `messages/${member.phone}`)
      set(messageRef, {
        from: user?.name,
        message,
        timestamp: Date.now()
      })
      toast.success(`Message sent to ${member.name}`)
    }
  }

  // Prepare map markers
  const mapMarkers = [
    {
      lat: locations[user?.uid]?.lat || 13.0827,
      lng: locations[user?.uid]?.lng || 80.2707,
      popup: 'You are here',
      icon: L.divIcon({
        html: '<i class="fas fa-user-circle text-success" style="font-size: 30px;"></i>',
        iconSize: [30, 30]
      })
    },
    ...familyMembers
      .filter(m => locations[m.phone])
      .map(member => ({
        lat: locations[member.phone].lat,
        lng: locations[member.phone].lng,
        popup: `${member.name} (${member.relation})`,
        icon: L.divIcon({
          html: `<i class="fas fa-user-circle text-primary-500" style="font-size: 25px;"></i>`,
          iconSize: [25, 25]
        })
      }))
  ]

  return (
    <div className="space-y-6">
      {/* Family Members Map */}
      <Card className="p-2">
        <Map
          center={{ lat: locations[user?.uid]?.lat || 13.0827, lng: locations[user?.uid]?.lng || 80.2707 }}
          markers={mapMarkers}
          height="350px"
        />
      </Card>

      {/* Add Member Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Add Family Member
        </Button>
      </div>

      {/* Family Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((member) => (
          <Card key={member.id} className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  member.status === 'online' ? 'bg-success' : 'bg-gray-400'
                }`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.relation}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                member.status === 'online' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {member.status === 'online' ? '● Online' : '○ Offline'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="w-4 h-4 text-gray-500" />
                <span>{member.phone}</span>
              </div>
              
              {locations[member.phone] && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs">
                    Updated {new Date(locations[member.phone].timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {member.battery && (
                <div className="flex items-center gap-2 text-sm">
                  <Battery100Icon className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success"
                      style={{ width: `${member.battery}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => requestLocation(member.id)}
              >
                <MapPinIcon className="w-4 h-4 mr-1" />
                Locate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => messageMember(member.id)}
              >
                <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                Message
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFamilyMember(member.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Family Member</h3>
            
            <div className="space-y-4">
              <Input
                label="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Enter full name"
              />
              
              <Input
                label="Phone Number"
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                placeholder="10-digit phone number"
              />
              
              <Input
                label="Relation"
                value={newMember.relation}
                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                placeholder="e.g., Mother, Sister, Friend"
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={addFamilyMember}
                  loading={loading}
                >
                  Add Member
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default FamilyTracker





