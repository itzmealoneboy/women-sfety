import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Flag, MoreVertical, User, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PostCard({ post, onLike, onComment, onShare, onReport }) {
  const [liked, setLiked] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    onLike?.(post.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={20} className="text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              {post.isAnonymous && (
                <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs">Anonymous</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
              <button
                onClick={() => onReport?.(post.id)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
              >
                <Flag size={14} />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.media && post.media.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {post.media.map((media, index) => (
              <img
                key={index}
                src={media}
                alt={`Post media ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Heart size={14} className="fill-red-500 text-red-500" />
          <span>{post.likes || 0}</span>
        </div>
        <div>{post.comments || 0} comments</div>
        <div>{post.shares || 0} shares</div>
      </div>
      
      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            liked ? 'text-red-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart size={18} className={liked ? 'fill-red-600' : ''} />
          <span>Like</span>
        </button>
        
        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>
        
        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </motion.div>
  )
}
