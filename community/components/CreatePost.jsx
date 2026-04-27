import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Image, Send, X, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreatePost({ onCreatePost }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [media, setMedia] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files)
    const newMedia = files.map(file => URL.createObjectURL(file))
    setMedia([...media, ...newMedia])
  }

  const removeMedia = (index) => {
    const newMedia = media.filter((_, i) => i !== index)
    setMedia(newMedia)
  }

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error('Please add some content to your post')
      return
    }

    setIsSubmitting(true)
    
    try {
      const postData = {
        content: content.trim(),
        isAnonymous,
        media,
        createdAt: new Date().toISOString()
      }
      
      await onCreatePost(postData)
      setContent('')
      setMedia([])
      setIsAnonymous(false)
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts, experiences, or ask for support..."
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      />
      
      {media.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {media.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt={`Media ${index + 1}`} className="rounded-lg w-full h-24 object-cover" />
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Image size={18} />
            <span className="text-sm">Add Media</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleMediaUpload}
            className="hidden"
          />
          
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition ${
              isAnonymous
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isAnonymous ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="text-sm">{isAnonymous ? 'Anonymous' : 'Public'}</span>
          </button>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
        >
          <Send size={18} />
          <span>Post</span>
        </button>
      </div>
      
      {isAnonymous && (
        <div className="mt-2 flex items-start space-x-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>Your identity will be hidden. Anonymous posts cannot be traced back to you.</span>
        </div>
      )}
    </motion.div>
  )
}
