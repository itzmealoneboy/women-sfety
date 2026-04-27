import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authstores'
import { collection, query, orderBy, limit, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebases'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FireIcon,
  ClockIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Forum = () => {
  const { user } = useAuthStore()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewTopic, setShowNewTopic] = useState(false)
  const [newTopic, setNewTopic] = useState({
    title: '',
    category: 'safety',
    content: ''
  })

  const categories = [
    { id: 'all', name: 'All Topics', icon: ChatBubbleBottomCenterTextIcon },
    { id: 'safety', name: 'Safety Tips', icon: FireIcon },
    { id: 'legal', name: 'Legal Help', icon: ChatBubbleLeftRightIcon },
    { id: 'support', name: 'Support Group', icon: UserGroupIcon },
    { id: 'awareness', name: 'Awareness', icon: ChatBubbleBottomCenterTextIcon }
  ]

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      const q = query(
        collection(db, 'forumTopics'),
        orderBy('lastActivity', 'desc'),
        limit(50)
      )
      const querySnapshot = await getDocs(q)
      const topicsData = []
      querySnapshot.forEach((doc) => {
        topicsData.push({ id: doc.id, ...doc.data() })
      })
      setTopics(topicsData)
    } catch (error) {
      // Use mock data if Firebase fails
      setTopics(mockTopics)
    } finally {
      setLoading(false)
    }
  }

  // Extended mock data for demonstration
  const mockTopics = [
    // --- SAFETY TIPS ---
    {
      id: 1,
      title: 'Self-defense techniques every woman should know',
      category: 'safety',
      author: 'Priya S.',
      replies: 23,
      views: 456,
      lastActivity: '2 hours ago',
      pinned: true,
      hot: true
    },
    {
      id: 5,
      title: 'Safe public transport tips for night travel',
      category: 'safety',
      author: 'Anjali T.',
      replies: 31,
      views: 678,
      lastActivity: '4 hours ago',
      pinned: true,
      hot: true
    },
    {
      id: 6,
      title: 'How to secure your smartphone from spyware and tracking',
      category: 'safety',
      author: 'Kavitha M.',
      replies: 18,
      views: 312,
      lastActivity: '1 day ago',
      pinned: false,
      hot: false
    },
    {
      id: 7,
      title: 'Emergency SOS apps: Which ones actually work offline?',
      category: 'safety',
      author: 'Sneha R.',
      replies: 42,
      views: 890,
      lastActivity: '3 hours ago',
      pinned: false,
      hot: true
    },
    {
      id: 8,
      title: 'How to escape if someone grabs your wrist (Simple tricks)',
      category: 'safety',
      author: 'Megha L.',
      replies: 56,
      views: 1205,
      lastActivity: '5 mins ago',
      pinned: false,
      hot: true
    },
    {
      id: 9,
      title: 'Carrying pepper spray: Legal rules and how to use it safely',
      category: 'safety',
      author: 'Tara N.',
      replies: 14,
      views: 240,
      lastActivity: '2 days ago',
      pinned: false,
      hot: false
    },

    // --- LEGAL HELP ---
    {
      id: 2,
      title: 'Legal rights when facing workplace harassment',
      category: 'legal',
      author: 'Lakshmi R.',
      replies: 15,
      views: 289,
      lastActivity: '5 hours ago',
      pinned: false,
      hot: true
    },
    {
      id: 10,
      title: 'How to file an FIR without going to the police station?',
      category: 'legal',
      author: 'Adv. Geeta K.',
      replies: 89,
      views: 2100,
      lastActivity: '1 hour ago',
      pinned: true,
      hot: true
    },
    {
      id: 11,
      title: 'Domestic violence: Steps to get a restraining order in India',
      category: 'legal',
      author: 'Simran P.',
      replies: 27,
      views: 530,
      lastActivity: '12 hours ago',
      pinned: false,
      hot: false
    },
    {
      id: 12,
      title: 'What is the POSH Act and how to use it in your company',
      category: 'legal',
      author: 'Roshni V.',
      replies: 11,
      views: 180,
      lastActivity: '3 days ago',
      pinned: false,
      hot: false
    },
    {
      id: 13,
      title: 'Understanding your rights during a police interrogation',
      category: 'legal',
      author: 'Adv. Nithya',
      replies: 34,
      views: 645,
      lastActivity: '1 day ago',
      pinned: false,
      hot: false
    },
    {
      id: 14,
      title: 'Cyberbullying laws: Can you sue someone for defamation online?',
      category: 'legal',
      author: 'Pooja B.',
      replies: 45,
      views: 720,
      lastActivity: '6 hours ago',
      pinned: false,
      hot: true
    },

    // --- SUPPORT GROUP ---
    {
      id: 3,
      title: 'Dealing with anxiety and stress - Support group',
      category: 'support',
      author: 'Meena K.',
      replies: 45,
      views: 1023,
      lastActivity: '1 day ago',
      pinned: false,
      hot: false
    },
    {
      id: 15,
      title: 'Healing after trauma: Share your stories and recover together',
      category: 'support',
      author: 'Dr. Anita (Therapist)',
      replies: 120,
      views: 3400,
      lastActivity: '10 mins ago',
      pinned: true,
      hot: true
    },
    {
      id: 16,
      title: 'Seeking therapist recommendations in Chennai',
      category: 'support',
      author: 'Bhavya S.',
      replies: 8,
      views: 145,
      lastActivity: '2 hours ago',
      pinned: false,
      hot: false
    },
    {
      id: 17,
      title: 'How to help a friend who is stuck in a toxic relationship',
      category: 'support',
      author: 'Farah A.',
      replies: 62,
      views: 890,
      lastActivity: '1 day ago',
      pinned: false,
      hot: true
    },
    {
      id: 18,
      title: 'Weekly virtual meetup for domestic abuse survivors',
      category: 'support',
      author: 'Ngo Coordinator',
      replies: 22,
      views: 410,
      lastActivity: '4 hours ago',
      pinned: false,
      hot: false
    },

    // --- AWARENESS ---
    {
      id: 4,
      title: 'How to identify online scams and fraud',
      category: 'awareness',
      author: 'Divya M.',
      replies: 12,
      views: 167,
      lastActivity: '3 days ago',
      pinned: false,
      hot: false
    },
    {
      id: 19,
      title: 'Spotting hidden cameras in hotel rooms and changing rooms',
      category: 'awareness',
      author: 'TechSavvy Girl',
      replies: 95,
      views: 2800,
      lastActivity: '30 mins ago',
      pinned: true,
      hot: true
    },
    {
      id: 20,
      title: 'Red flags to watch out for on first dates',
      category: 'awareness',
      author: 'Shruti D.',
      replies: 134,
      views: 4500,
      lastActivity: 'Just now',
      pinned: false,
      hot: true
    },
    {
      id: 21,
      title: 'Catfishing awareness: How to reverse search a profile picture',
      category: 'awareness',
      author: 'Cyber Team',
      replies: 28,
      views: 560,
      lastActivity: '2 days ago',
      pinned: false,
      hot: false
    },
    {
      id: 22,
      title: 'Explaining "consent" to younger siblings and children',
      category: 'awareness',
      author: 'Radhika J.',
      replies: 41,
      views: 820,
      lastActivity: '14 hours ago',
      pinned: false,
      hot: false
    },
    {
      id: 23,
      title: 'The rise of AI deepfakes and how to protect your photos online',
      category: 'awareness',
      author: 'Cyber Team',
      replies: 76,
      views: 1950,
      lastActivity: '1 hour ago',
      pinned: false,
      hot: true
    }
  ]

  const createTopic = async () => {
    if (!newTopic.title || !newTopic.content) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const topicData = {
        ...newTopic,
        userId: user?.uid,
        author: user?.name,
        replies: 0,
        views: 0,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        pinned: false,
        hot: false
      }

      const docRef = await addDoc(collection(db, 'forumTopics'), topicData)
      
      setTopics([{ id: docRef.id, ...topicData }, ...topics])
      setShowNewTopic(false)
      setNewTopic({ title: '', category: 'safety', content: '' })
      
      toast.success('Topic created successfully!')
    } catch (error) {
      toast.error('Failed to create topic')
    }
  }

  const filteredTopics = topics.filter(topic => {
    if (selectedCategory !== 'all' && topic.category !== selectedCategory) return false
    if (searchTerm) {
      return topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             topic.content?.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Search and New Topic */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          />
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNewTopic(true)}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Topic
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </button>
        ))}
      </div>

      {/* Topics List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading topics...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => toast.info('Topic view coming soon')}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  topic.category === 'safety' ? 'bg-success/10 text-success' :
                  topic.category === 'legal' ? 'bg-primary-500/10 text-primary-600' :
                  topic.category === 'support' ? 'bg-warning/10 text-warning' :
                  'bg-secondary-500/10 text-secondary-600'
                }`}>
                  {topic.category === 'safety' && <FireIcon className="w-5 h-5" />}
                  {topic.category === 'legal' && <ChatBubbleLeftRightIcon className="w-5 h-5" />}
                  {topic.category === 'support' && <UserGroupIcon className="w-5 h-5" />}
                  {topic.category === 'awareness' && <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />}
                </div>

                {/* Topic Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {topic.title}
                        {topic.pinned && (
                          <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                            📌 Pinned
                          </span>
                        )}
                        {topic.hot && (
                          <span className="ml-2 text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full animate-pulse">
                            🔥 Hot
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {topic.author} • {topic.lastActivity}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      {topic.replies} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4" />
                      {topic.views} views
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Topic Modal */}
      <Modal
        isOpen={showNewTopic}
        onClose={() => setShowNewTopic(false)}
        title="Create New Topic"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newTopic.title}
            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
            placeholder="Summarize your topic"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={newTopic.category}
              onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              {categories.filter(c => c.id !== 'all').map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={newTopic.content}
              onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              placeholder="Write your topic content..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowNewTopic(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={createTopic}
            >
              Create Topic
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Forum





