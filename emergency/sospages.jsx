import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmergencyStore } from '../../store/emergencystore'
import { useLocationStore } from '../../store/locationsstore'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { FaWhatsapp, FaEnvelope, FaSms } from 'react-icons/fa'
import toast from 'react-hot-toast'

const SOSPage = () => {
  const [timer, setTimer] = useState(10)
  const [sosActive, setSosActive] = useState(false)
  const [sosSent, setSosSent] = useState(false)

  const { triggerSOS, cancelSOS, emergencyContacts } = useEmergencyStore()
  const { currentLocation } = useLocationStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (sosActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)

      return () => clearInterval(interval)
    } else if (timer === 0 && sosActive) {
      handleSendSOS()
    }
  }, [sosActive, timer])

  const handleSOSStart = () => {
    setSosActive(true)
    setTimer(10)
    toast.error('SOS Activated! 10 seconds to respond', {
      icon: '🚨',
      duration: 5000
    })
  }

  const handleSafe = () => {
    setSosActive(false)
    setTimer(10)
    toast.success('You are safe! SOS cancelled')
  }

  const handleShare = (method) => {
    if (!currentLocation) {
        toast.error('Location not available yet.');
        return;
    }
    const link = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}&type=live`;
    const message = `🚨 EMERGENCY! I am NOT SAFE. Help is needed immediately. Here is my live location: ${link}`;
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=EMERGENCY SOS! Need Help&body=${encodeURIComponent(message)}`, '_blank');
        break;
      default:
        break;
    }
  }

  const handleSendSOS = () => {
    // Fire the backend trigger in the background without blocking the UI
    // Firebase addDoc hangs indefinitely if offline, so we avoid awaiting it.
    triggerSOS(currentLocation).then((result) => {
      if (result && result.success) {
        toast.success('🚨 SOS Sent to emergency contacts and police!', {
          duration: 8000
        })
      } else {
        toast.error('Network SOS failed or queued. Manual Backup Share ready.', {
          duration: 4000
        })
      }
    }).catch(() => {
        toast.error('Network SOS offline. Manual share active.');
    });
    
    // Instantly transition the screen
    setSosSent(true)
    setSosActive(false)
    
    // Automatically execute the external application share flow (WhatsApp)
    handleShare('whatsapp')
  }

  const getTimerColor = () => {
    if (timer > 7) return 'text-gray-800'
    if (timer > 3) return 'text-warning'
    return 'text-danger animate-pulse'
  }

  if (sosSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-danger rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
            <ExclamationTriangleIcon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">SOS SENT!</h1>
          <p className="text-gray-600 mb-6">
            Emergency services and your contacts have been notified
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left shadow-sm">
            <div className="flex items-center gap-3 mb-3 border-b pb-2">
              <MapPinIcon className="w-5 h-5 text-danger" />
              <span className="text-sm font-semibold">
                {currentLocation.lat.toFixed(6)}°N, {currentLocation.lng.toFixed(6)}°E
              </span>
            </div>

            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{contact.name} - {contact.phone}</span>
                  <CheckCircleIcon className="w-4 h-4 text-success ml-auto" />
                </div>
              ))}
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-4 h-4 text-primary-500" />
                <span className="text-sm">Police (100) notified</span>
                <CheckCircleIcon className="w-4 h-4 text-success ml-auto" />
              </div>
            </div>
          </div>

          {/* Additional Share Options */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 font-semibold mb-3">Manually Share Live Location:</p>
            <div className="flex justify-center gap-5">
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-1 group">
                <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-200 transition-colors shadow-sm">
                  <FaWhatsapp size={22} />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('sms')} className="flex flex-col items-center gap-1 group">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full group-hover:bg-yellow-200 transition-colors shadow-sm">
                  <FaSms size={22} />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">SMS Message</span>
              </button>
              <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-1 group">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200 transition-colors shadow-sm">
                  <FaEnvelope size={22} />
                </div>
                <span className="text-[10px] text-gray-600 font-medium">Email</span>
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="w-full shadow-md"
          >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  if (sosActive) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-warning rounded-full mx-auto mb-6 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">SOS ACTIVATED</h1>
          <p className="text-gray-600 mb-4">
            SOS will be sent automatically in
          </p>

          <div className={`text-7xl font-bold mb-6 ${getTimerColor()}`}>
            {timer}
          </div>

          <div className="space-y-3">
            <Button
              variant="success"
              size="lg"
              onClick={handleSafe}
              className="w-full shadow-md hover:shadow-lg transition-shadow"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              I'M SAFE (CANCEL)
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={handleSendSOS}
              className="w-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              NOT SAFE - TRIGGER SOS
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Emergency contacts will be notified with your location
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-danger rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
          <ExclamationTriangleIcon className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Emergency SOS</h1>
        <p className="text-gray-600 mb-6">
          Press the button below in case of emergency. Your location will be shared with emergency contacts and police.
        </p>

        <div className="space-y-3">
          <Button
            variant="danger"
            size="lg"
            onClick={handleSOSStart}
            className="w-full animate-pulse shadow-lg"
          >
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            ACTIVATE SOS
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/emergency-hub')}
            className="w-full"
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            Emergency Numbers
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800">Your Emergency Contacts</h3>
          {emergencyContacts.length > 0 ? (
            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{contact.name}</span>
                  <span className="text-gray-500">{contact.phone}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No emergency contacts added. Add them in Emergency Hub.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default SOSPage

