import { useState } from 'react'
import SocialFeed from './socialfeed'
import Forum from './forum'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { 
  UsersIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed')

  const tabs = [
    { id: 'feed', name: 'Social Feed', icon: NewspaperIcon },
    { id: 'forum', name: 'Forum', icon: ChatBubbleLeftRightIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            👥 Community Hub
          </h1>
          <p className="text-gray-600 mt-1">
            Connect • Share • Support • Learn from each other
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
            <UsersIcon className="w-5 h-5 text-primary-500" />
            <span className="font-medium">1,234 members</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
            <UserGroupIcon className="w-5 h-5 text-success" />
            <span className="font-medium">56 online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {activeTab === 'feed' && <SocialFeed />}
        {activeTab === 'forum' && <Forum />}
      </div>

      {/* Community Guidelines */}
      <Card className="bg-primary-50 border border-primary-200">
        <h3 className="font-semibold text-primary-800 mb-2">Community Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-primary-700">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">1</div>
            <p>Be respectful and supportive</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">2</div>
            <p>No hate speech or harassment</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">3</div>
            <p>Protect your privacy</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CommunityHub
