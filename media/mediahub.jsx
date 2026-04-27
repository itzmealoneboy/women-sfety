import { useState } from 'react'
import Camera from './camera'
import Gallery from './gallery'
import AIMisuseDetection from './aimissusedetections'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { SakshiEyeEvidenceFolder } from '../../components/sakshieye/SakshiEyeComponents'
import { useSakshiEyeStore } from '../../store/sakshieyestore'
import { 
  CameraIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  FilmIcon
} from '@heroicons/react/24/outline'

const MediaHub = () => {
  const [activeTab, setActiveTab] = useState('camera')
  const { capturedFaces, autoRecordings } = useSakshiEyeStore()

  const tabs = [
    { id: 'camera', name: 'Camera', icon: CameraIcon },
    { id: 'gallery', name: 'Gallery', icon: PhotoIcon },
    { id: 'ai', name: 'AI Image Check', icon: MagnifyingGlassIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          📹 Media Hub
        </h1>
        <p className="text-gray-600 mt-1">
          Camera, Gallery, and AI Image Misuse Detection - All in One Place
        </p>
      </div>

      {/* SAKHI EYE Evidence Folder */}
      <SakshiEyeEvidenceFolder
        facesCount={capturedFaces.length}
        recordingsCount={autoRecordings.length}
        reportsCount={0}
      />

      {/* Tabs */}
      <div className="border-b border-gray-100 pb-2 bg-[#f8f9fa] rounded-t-xl overflow-hidden p-2">
        <nav className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#7E57C2] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'camera' && <Camera />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'ai' && <AIMisuseDetection />}
      </div>
    </div>
  )
}

export default MediaHub
