import { useNavigate } from 'react-router-dom'
import Button from '../../../components/common/Button'
import {
  ExclamationTriangleIcon,
  MapIcon,
  MicrophoneIcon,
  PhoneIcon,
  CameraIcon,
  ShieldCheckIcon,
  ScaleIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'SOS',
    to: '/sos',
    icon: ExclamationTriangleIcon,
    color: 'bg-danger',
    hover: 'hover:bg-red-600'
  },
  {
    name: 'Live Tracking',
    to: '/live-tracking',
    icon: MapIcon,
    color: 'bg-primary-500',
    hover: 'hover:bg-primary-600'
  },
  {
    name: 'Voice Clone',
    to: '/ai-voice-clone',
    icon: MicrophoneIcon,
    color: 'bg-secondary-500',
    hover: 'hover:bg-secondary-600'
  },
  {
    name: 'Fake Call',
    to: '/ai-fake-call',
    icon: PhoneIcon,
    color: 'bg-warning',
    hover: 'hover:bg-orange-600'
  },
  {
    name: 'Media Hub',
    to: '/media-hub',
    icon: CameraIcon,
    color: 'bg-purple-500',
    hover: 'hover:bg-purple-600'
  },
  {
    name: 'AI Threat',
    to: '/ai-threat',
    icon: ShieldCheckIcon,
    color: 'bg-indigo-500',
    hover: 'hover:bg-indigo-600'
  },
  {
    name: 'Legal Hub',
    to: '/legal-hub',
    icon: ScaleIcon,
    color: 'bg-green-500',
    hover: 'hover:bg-green-600'
  },
  {
    name: 'Benefits',
    to: '/benefits',
    icon: GiftIcon,
    color: 'bg-pink-500',
    hover: 'hover:bg-pink-600'
  }
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {actions.map((action) => (
          <button
            key={action.to}
            onClick={() => navigate(action.to)}
            className="group text-center"
          >
            <div className={`w-14 h-14 mx-auto ${action.color} rounded-xl flex items-center justify-center text-white group-hover:shadow-lg transition-all group-hover:-translate-y-1 mb-2`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-600">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
