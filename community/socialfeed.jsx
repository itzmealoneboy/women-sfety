import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authstores'
import { collection, query, orderBy, limit, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebases'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import { 
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  FlagIcon,
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  MapPinIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const SocialFeed = () => {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    content: '',
    location: '',
    image: null
  })
  const [selectedPost, setSelectedPost] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      const querySnapshot = await getDocs(q)
      const postsData = []
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() })
      })
      setPosts(postsData)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async () => {
    if (!newPost.content.trim()) {
      toast.error('Please write something')
      return
    }

    try {
      const postData = {
        userId: user?.uid,
        userName: user?.name,
        userAvatar: user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff`,
        content: newPost.content,
        location: newPost.location || null,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        likedBy: []
      }

      const docRef = await addDoc(collection(db, 'posts'), postData)
      
      setPosts([{ id: docRef.id, ...postData }, ...posts])
      setShowCreatePost(false)
      setNewPost({ content: '', location: '', image: null })
      
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    }
  }

  const likePost = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const hasLiked = post.likedBy?.includes(user?.uid)
      
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            likedBy: hasLiked 
              ? p.likedBy?.filter(id => id !== user?.uid)
              : [...(p.likedBy || []), user?.uid]
          }
        }
        return p
      }))

      // TODO: Update in Firebase
      
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const deletePost = async (postId) => {
    if (!confirm('Delete this post?')) return

    try {
      await deleteDoc(doc(db, 'posts', postId))
      setPosts(posts.filter(p => p.id !== postId))
      toast.success('Post deleted')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const addComment = async (postId) => {
    if (!commentText.trim()) return

    try {
      const commentData = {
        postId,
        userId: user?.uid,
        userName: user?.name,
        userAvatar: user?.photoURL,
        content: commentText,
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'comments'), commentData)
      
      // Update comment count
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: (p.comments || 0) + 1 }
        }
        return p
      }))

      setCommentText('')
      toast.success('Comment added')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <Button
        variant="primary"
        onClick={() => setShowCreatePost(true)}
        className="w-full"
      >
        <PaperAirplaneIcon className="w-5 h-5 mr-2" />
        Share Your Thoughts
      </Button>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">Be the first to share something!</p>
          <Button
            variant="primary"
            onClick={() => setShowCreatePost(true)}
          >
            Create First Post
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{post.userName}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(post.createdAt)}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            {post.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Options */}
                {post.userId === user?.uid && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full rounded-lg mb-4 max-h-96 object-cover"
                />
              )}

              {/* Post Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>{post.likes || 0} likes</span>
                <span>{post.comments || 0} comments</span>
              </div>

              {/* Post Actions */}
              <div className="flex items-center border-t border-gray-100 pt-3">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                    post.likedBy?.includes(user?.uid)
                      ? 'text-danger'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {post.likedBy?.includes(user?.uid) ? (
                    <HeartIconSolid className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">Like</span>
                </button>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied to clipboard')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        title="Create Post"
      >
        <div className="space-y-4">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            placeholder="What would you like to share?"
          />

          <Input
            placeholder="Add location (optional)"
            value={newPost.location}
            onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
            icon={<MapPinIcon className="w-5 h-5" />}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => document.getElementById('postImage').click()}
            >
              <PhotoIcon className="w-5 h-5 mr-2" />
              Add Photo
            </Button>
            <input
              id="postImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                // Handle image upload
                toast.info('Image upload coming soon')
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCreatePost(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={createPost}
            >
              Post
            </Button>
          </div>
        </div>
      </Modal>

      {/* Comments Modal */}
      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Comments"
        size="lg"
      >
        {selectedPost && (
          <div className="space-y-4">
            {/* Original Post */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-800">{selectedPost.content}</p>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* TODO: Load comments from Firebase */}
              <p className="text-center text-gray-500 py-4">No comments yet</p>
            </div>

            {/* Add Comment */}
            <div className="flex gap-3 pt-4 border-t">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
              <Button
                variant="primary"
                onClick={() => addComment(selectedPost.id)}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SocialFeed





