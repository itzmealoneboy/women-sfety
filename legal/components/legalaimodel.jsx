import { useState } from 'react'
import Modal from '../../../components/common/Modal'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { LANGUAGES } from '../../../config/constant'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const LegalAIModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('en')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!query) {
      toast.error('Please enter your question')
      return
    }

    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ''
      
      if (query.toLowerCase().includes('domestic violence')) {
        response = language === 'ta' 
          ? 'நீங்கள் பாதுகாப்பு சட்டம் 2005 (Domestic Violence Act) மூலம் பாதுகாக்கப்படுகிறீர்கள். நீங்கள் புகார் அளிக்க 181 அல்லது 1091-ஐ அழைக்கலாம்.'
          : 'You are protected under the Protection of Women from Domestic Violence Act 2005. You can call 181 or 1091 to file a complaint.'
      } else if (query.toLowerCase().includes('workplace harassment')) {
        response = language === 'ta'
          ? 'பணியிட பாலியல் துன்புறுத்தல் சட்டம் 2013 (POSH Act) கீழ் குற்றம். நீங்கள் உங்கள் நிறுவனத்தில் உள்ள Internal Complaints Committee (ICC) -க்கு புகார் அளிக்க வேண்டும்.'
          : 'Sexual harassment at workplace is a crime under POSH Act 2013. You must file a complaint with your organization\'s Internal Complaints Committee (ICC).'
      } else {
        response = language === 'ta'
          ? 'உங்கள் கேள்விக்கு பதில் அளிக்க, தயவுசெய்து மேலும் விவரங்களைக் கொடுங்கள். நீங்கள் 15100-ஐ அழைத்து இலவச சட்ட ஆலோசனை பெறலாம்.'
          : 'To answer your question accurately, please provide more details. You can also call 15100 for free legal advice.'
      }

      setResponse(response)
      setLoading(false)
    }, 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Legal Assistant" size="lg">
      <div className="space-y-4">
        <div className="bg-primary-50 p-4 rounded-lg">
          <p className="text-sm text-primary-700">
            Ask your legal problem in simple words. I'll help you understand your rights and next steps.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Your Question
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            placeholder="e.g., My husband is harassing me, Workplace harassment, Property dispute..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleAsk}
              loading={loading}
            >
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Ask
            </Button>
          </div>
        </div>

        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Response:</p>
                <p className="text-sm text-gray-600">{response}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default LegalAIModal
