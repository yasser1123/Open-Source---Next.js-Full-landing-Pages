"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Clock,
  Award,
  Palette,
  Camera,
  Music,
  Globe,
  Activity,
  X,
} from "lucide-react"

// Interface definitions for data structures
interface Topic {
  name: string
  icon: React.ReactNode
  color: string
  gradient: string
}

interface Post {
  id: number
  title: string
  content: string
  author: string
  time: string
  topic: string
  likes: number
  isPremium?: boolean
  readTime?: string
  imageUrl: string
}

interface PostCardProps {
  post: Post
  topics: Topic[]
  onLike: (id: number, e: React.MouseEvent) => void
  likedPosts: number[]
}

// Topic definitions with their visual styles
const topics: Topic[] = [
{
name: "Technology",
icon: <Award className="w-5 h-5" />,
color: "text-indigo-500",
gradient: "from-indigo-500/10 to-indigo-600/10",
},
{
name: "Design",
icon: <Palette className="w-5 h-5" />,
color: "text-rose-500",
gradient: "from-rose-500/10 to-rose-600/10",
},
{
name: "Photography",
icon: <Camera className="w-5 h-5" />,
color: "text-emerald-500",
gradient: "from-emerald-500/10 to-emerald-600/10",
},
{
name: "Music",
icon: <Music className="w-5 h-5" />,
color: "text-purple-500",
gradient: "from-purple-500/10 to-purple-600/10",
},
{
name: "Travel",
icon: <Globe className="w-5 h-5" />,
color: "text-teal-500",
gradient: "from-teal-500/10 to-teal-600/10",
},
{
name: "Lifestyle",
icon: <Activity className="w-5 h-5" />,
color: "text-orange-500",
gradient: "from-orange-500/10 to-orange-600/10",
},
]

// PostCard component to display individual post cards
const PostCard: React.FC<PostCardProps> = ({ post, topics, onLike, likedPosts }) => {
  // Find the topic object matching this post's topic
  const topic = topics.find((t) => t.name === post.topic)

  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer"
      whileHover={{ y: -4 }}
      layout
    >
      {/* Post image section with premium badge if applicable */}
      <div className="relative h-56 overflow-hidden">
        {post.isPremium && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10 backdrop-blur-sm">
            Premium
          </div>
        )}
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Post content section */}
      <div className="p-6">
        {/* Topic badge and read time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${topic?.gradient || "from-gray-200 to-gray-300"}`}>
              {topic?.icon}
            </div>
            <span className={`text-sm font-medium ${topic?.color || "text-gray-500"}`}>{post.topic}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs space-x-2">
            <Clock className="w-3 h-3" />
            <span>{post.readTime || "5 min read"}</span>
          </div>
        </div>
        
        {/* Post title and excerpt */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-gray-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-5 line-clamp-3">{post.content}</p>
        
        {/* Author info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{post.author}</span>
          </div>
        </div>
        
        {/* Like button with active/inactive states */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={(e) => onLike(post.id, e)}
            className={`flex items-center space-x-2 ${
              likedPosts.includes(post.id)
                ? "text-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart 
              className={`w-5 h-5 ${likedPosts.includes(post.id) ? "fill-indigo-500" : ""}`} 
            />
            <span className="text-sm font-medium">{post.likes}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Main SocialFeed component
const SocialFeed: React.FC = () => {
  // State management for the social feed
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  // Handle like/unlike interactions
  const handleLike = (postId: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }
  
  // Open the post detail modal
  const handlePostClick = (post: Post): void => {
    setSelectedPost(post);
    setShowModal(true);
  }

  // Close the post detail modal
  const closeModal = (): void => {
    setShowModal(false);
    setSelectedPost(null);
  }

  // Client-side rendering safety
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Post mock data with various topics and high-quality images
  const posts: Post[] = useMemo(
    () => [
      {
        id: 1,
        title: "Discover the Future of AI Technology",
        content:
          "Explore the cutting-edge innovations in artificial intelligence that are transforming industries and reshaping our future. From machine learning to neural networks, discover how AI is evolving.",
        author: "Alex Johnson",
        time: "2 hours ago",
        topic: "Technology",
        likes: 2421,
        readTime: "8 min read",
        isPremium: true,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        title: "10 Design Trends to Watch in 2025",
        content:
          "Stay ahead of the curve with these emerging design trends that will dominate the creative landscape in the coming year. From neomorphism to glassmorphism, these trends are reshaping digital experiences.",
        author: "Sarah Williams",
        time: "1 day ago",
        topic: "Design",
        likes: 1542,
        readTime: "6 min read",
        imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 3,
        title: "Capturing the World One Frame at a Time",
        content:
          "Journey through the lens of professional photographers as they share their techniques for capturing breathtaking moments and telling visual stories that resonate with audiences worldwide.",
        author: "Michael Chen",
        time: "3 days ago",
        topic: "Photography",
        likes: 3210,
        readTime: "10 min read",
        isPremium: true,
        imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 4,
        title: "The Healing Power of Music",
        content:
          "Delve into the science behind music's profound impact on our emotional and physical wellbeing, and discover how different genres and rhythms can influence our mood, productivity, and health.",
        author: "Emma Rodriguez",
        time: "2 weeks ago",
        topic: "Music",
        likes: 1876,
        readTime: "7 min read",
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 5,
        title: "Epic Adventures: Exploring Hidden Gems",
        content:
          "Embark on an unforgettable journey to discover the world's most stunning hidden destinations that remain untouched by mass tourism. From secluded beaches to ancient ruins, these locations offer authentic travel experiences.",
        author: "David Kim",
        time: "1 month ago",
        topic: "Travel",
        likes: 4532,
        readTime: "12 min read",
        isPremium: true,
        imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 6,
        title: "Mindfulness Practices for a Balanced Life",
        content:
          "Discover practical mindfulness techniques that can help you reduce stress, improve focus, and cultivate greater emotional wellbeing in your daily life. Learn how small changes can lead to profound improvements in your mental health.",
        author: "Sophia Martinez",
        time: "3 months ago",
        topic: "Lifestyle",
        likes: 2187,
        readTime: "9 min read",
        imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      },
    ],
    []
  )

  // Filter posts based on selected topic
  const filteredPosts = useMemo(() => {
    return selectedTopic === "all"
      ? posts
      : posts.filter((post) => post.topic === selectedTopic)
  }, [posts, selectedTopic])

  // Simulate loading state for better UX
  const changeFilter = (topic: string) => {
    setIsLoading(true)
    setSelectedTopic(topic)
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false)
    }, 600)
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 antialiased">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Discover and Connect
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore trending topics and connect with like-minded individuals through our curated content feed.
        </p>
      </div>

      {/* Filter tabs for topics */}
      <div className="flex flex-wrap items-center justify-center mb-12 gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => changeFilter("all")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
            selectedTopic === "all"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          All Topics
        </motion.button>

        {topics.map((topic) => (
          <motion.button
            key={topic.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeFilter(topic.name)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              selectedTopic === topic.name
                ? `bg-gradient-to-r ${topic.gradient.replace(
                    /from-(\w+-\d+)\/10/,
                    "from-$1"
                  )} ${topic.gradient.replace(
                    /to-(\w+-\d+)\/10/,
                    "to-$1"
                  )} text-white shadow-md`
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <span>{topic.icon}</span>
            <span>{topic.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Post grid layout */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[400px]"
            key="loading"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            key="content"
          >
            {filteredPosts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)}>
                <PostCard
                  post={post}
                  topics={topics}
                  onLike={handleLike}
                  likedPosts={likedPosts}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post detail modal */}
      <AnimatePresence>
        {showModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header with image */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                {selectedPost.isPremium && (
                  <div className="absolute top-6 right-6 bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-medium z-10 shadow-lg">
                    Premium
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              </div>

              {/* Modal content */}
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="mr-4 w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-lg">
                      {selectedPost.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {selectedPost.author}
                    </h4>
                    <p className="text-sm text-gray-500">{selectedPost.time}</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedPost.title}
                </h2>

                <div className="flex items-center space-x-4 mb-8">
                  {/* Find the topic object */}
                  {(() => {
                    const topic = topics.find(
                      (t) => t.name === selectedPost.topic
                    )
                    return (
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${
                            topic?.gradient || "from-gray-200 to-gray-300"
                          }`}
                        >
                          {topic?.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            topic?.color || "text-gray-500"
                          }`}
                        >
                          {selectedPost.topic}
                        </span>
                      </div>
                    )
                  })()}

                  <div className="flex items-center text-gray-500 text-sm space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedPost.readTime || "5 min read"}</span>
                  </div>
                </div>

                {/* Extended content for modal */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {selectedPost.content}
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>

                {/* Like button for modal */}
                <div className="flex justify-between items-center mt-12 border-t border-gray-100 pt-6">
                  <motion.button
                    onClick={(e) => handleLike(selectedPost.id, e)}
                    className={`flex items-center space-x-2 ${
                      likedPosts.includes(selectedPost.id)
                        ? "text-indigo-500"
                        : "text-gray-500 hover:text-indigo-500"
                    } transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        likedPosts.includes(selectedPost.id)
                          ? "fill-indigo-500"
                          : ""
                      }`}
                    />
                    <span className="text-base font-medium">
                      {selectedPost.likes}
                    </span>
                  </motion.button>

                  <button
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-colors shadow-md"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SocialFeed