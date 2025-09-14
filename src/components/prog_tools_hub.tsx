"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface Tool {
  id: string
  name: string
  description: string
  category: string
  framework: string[]
  rating: number
  reviewCount: number
  imageUrl: string
  url: string
  tags: string[]
}

interface Review {
  id: string
  toolId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  likes: number
}

// Sample data
const tools: Tool[] = [
  {
    id: "1",
    name: "React",
    description: "A JavaScript library for building user interfaces, particularly single-page applications.",
    category: "Frontend",
    framework: ["JavaScript", "TypeScript"],
    rating: 4.8,
    reviewCount: 1245,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    url: "https://reactjs.org",
    tags: ["UI", "Components", "State Management"]
  },
  {
    id: "2",
    name: "Next.js",
    description: "The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production.",
    category: "Frontend",
    framework: ["JavaScript", "TypeScript", "React"],
    rating: 4.9,
    reviewCount: 987,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    url: "https://nextjs.org",
    tags: ["SSR", "SSG", "Routing", "API Routes"]
  },
  {
    id: "3",
    name: "TypeScript",
    description: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
    category: "Language",
    framework: ["JavaScript"],
    rating: 4.7,
    reviewCount: 2156,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    url: "https://www.typescriptlang.org",
    tags: ["Type Safety", "JavaScript", "Development"]
  },
  {
    id: "4",
    name: "Tailwind CSS",
    description: "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
    category: "CSS",
    framework: ["CSS", "JavaScript"],
    rating: 4.6,
    reviewCount: 876,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    url: "https://tailwindcss.com",
    tags: ["Utility-First", "Responsive", "Customization"]
  },
  {
    id: "5",
    name: "Node.js",
    description: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.",
    category: "Backend",
    framework: ["JavaScript"],
    rating: 4.5,
    reviewCount: 1876,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    url: "https://nodejs.org",
    tags: ["Runtime", "Server", "NPM"]
  },
  {
    id: "6",
    name: "Vue.js",
    description: "Vue.js is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable.",
    category: "Frontend",
    framework: ["JavaScript"],
    rating: 4.7,
    reviewCount: 1123,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    url: "https://vuejs.org",
    tags: ["Progressive", "Components", "Reactivity"]
  },
  {
    id: "7",
    name: "Django",
    description: "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.",
    category: "Backend",
    framework: ["Python"],
    rating: 4.4,
    reviewCount: 765,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    url: "https://www.djangoproject.com",
    tags: ["Python", "ORM", "Admin"]
  },
  {
    id: "8",
    name: "Flutter",
    description: "Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
    category: "Mobile",
    framework: ["Dart"],
    rating: 4.6,
    reviewCount: 987,
    imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    url: "https://flutter.dev",
    tags: ["Cross-Platform", "UI", "Mobile"]
  }
]

const reviews: Review[] = [
  {
    id: "1",
    toolId: "1",
    userId: "user1",
    userName: "Alex Johnson",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    comment: "React has completely transformed how I build web applications. The component-based architecture makes it so much easier to maintain and scale my projects.",
    date: "2023-05-15",
    likes: 24
  },
  {
    id: "2",
    toolId: "1",
    userId: "user2",
    userName: "Sarah Williams",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    comment: "While React is powerful, the learning curve can be steep for beginners. Once you get past that, it's incredibly flexible and the ecosystem is vast.",
    date: "2023-06-02",
    likes: 18
  },
  {
    id: "3",
    toolId: "2",
    userId: "user3",
    userName: "Michael Chen",
    userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    comment: "Next.js is the perfect framework for React applications. The built-in routing, SSR, and API routes make development so much faster and more enjoyable.",
    date: "2023-04-28",
    likes: 32
  },
  {
    id: "4",
    toolId: "3",
    userId: "user4",
    userName: "Emily Rodriguez",
    userAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    comment: "TypeScript has significantly improved my development workflow. The type safety and better IDE support have reduced bugs and made refactoring much easier.",
    date: "2023-07-10",
    likes: 29
  }
]

// Color palette constants
// Commented out for now as it's not being used
// const colors = {
//   primary: {
//     light: "#6366F1", // Indigo
//     DEFAULT: "#4F46E5",
//     dark: "#4338CA",
//   },
//   secondary: {
//     light: "#10B981", // Emerald
//     DEFAULT: "#059669",
//     dark: "#047857",
//   },
//   background: {
//     light: "#F9FAFB",
//     dark: "#111827",
//   },
//   card: {
//     light: "#FFFFFF",
//     dark: "#1F2937",
//   },
//   text: {
//     light: {
//       primary: "#111827",
//       secondary: "#4B5563",
//       muted: "#6B7280",
//     },
//     dark: {
//       primary: "#F9FAFB",
//       secondary: "#E5E7EB",
//       muted: "#9CA3AF",
//     },
//   }
// }

// Hero Section
const HeroSection = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-900 dark:to-violet-900 mb-12 rounded-3xl">
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="heroglow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" r="30" fill="url(#heroglow)" />
          <circle cx="80" cy="80" r="30" fill="url(#heroglow)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-20 lg:py-24 h-full flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Discover the Best
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                Developer Tools
              </span>
            </h1>
            <p className="text-lg text-indigo-100 mb-8 max-w-lg">
              Find, compare, and discuss the most powerful programming tools and frameworks 
              to enhance your development workflow.
            </p>

            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                    alt={`Developer ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-indigo-600"
                  />
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-indigo-100">
                  <span className="font-semibold">4.9/5</span> from over 3,000 reviews
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-lg font-medium text-sm shadow-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  5.0
                </div>
              </div>
              <div className="p-6">
                <img 
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" 
                  alt="Next.js" 
                  className="w-12 h-12 mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Next.js</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  &ldquo;Next.js has completely transformed my development workflow. The built-in routing, SSR capabilities, and API routes make it the perfect React framework.&rdquo;
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Reviewer" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Michael Chen</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Senior Developer</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">987 reviews</span>
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-50 blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Components
const ToolCard = ({ tool, onSelect }: { tool: Tool; onSelect: (tool: Tool) => void }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onSelect(tool)}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg mr-4">
            <img src={tool.imageUrl} alt={tool.name} className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tool.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{tool.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{tool.reviewCount} reviews</span>
        </div>
      </div>
    </motion.div>
  )
}

const ReviewCard = ({ review, onLike }: { review: Review; onLike: (reviewId: string) => void }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [liked, setLiked] = useState(false)
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!liked) {
      setLiked(true)
      onLike(review.id)
    }
  }
  
  const handleReplySubmit = () => {
    console.log(`Reply to review ${review.id}: ${replyText}`)
    // In a real app, this would post the reply to the backend
    setShowReplyForm(false)
    setReplyText("")
    // Show a toast notification or some kind of confirmation
    alert("Reply submitted!")
  }
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-4"
      >
        <div className="flex items-center mb-3">
          <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{review.userName}</h4>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <button 
            className={`flex items-center mr-4 transition-colors duration-200 ${
              liked 
                ? 'text-red-500 dark:text-red-400' 
                : 'hover:text-indigo-500 dark:hover:text-indigo-400'
            }`}
            onClick={handleLike}
            disabled={liked}
            aria-label={liked ? "Already liked" : "Like this review"}
            title={liked ? "Already liked" : "Like this review"}
          >
            <svg className="w-4 h-4 mr-1" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {review.likes + (liked ? 1 : 0)}
          </button>
          <button 
            className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation()
              setShowReplyForm(!showReplyForm)
            }}
            aria-label="Reply to this review"
            title="Reply to this review"
          >
            Reply
          </button>
        </div>
      </motion.div>
      
      {showReplyForm && (
        <div className="ml-10 mt-2 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
              rows={2}
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2 space-x-2">
              <button 
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                onClick={() => setShowReplyForm(false)}
                aria-label="Cancel reply"
                title="Cancel reply"
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                aria-label="Submit reply"
                title="Submit reply"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const ReviewForm = ({ toolId, onSubmit }: { toolId: string; onSubmit: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'date' | 'likes'>) => void }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ toolId, rating, comment })
    setComment("")
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
              aria-label={`Rate ${star} stars`}
              title={`Rate ${star} stars`}
            >
              <svg 
                className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        aria-label="Submit review"
        title="Submit review"
      >
        Submit Review
      </button>
    </form>
  )
}

const ToolDetail = ({ tool, onClose }: { tool: Tool; onClose: () => void }) => {
  const [toolReviews, setToolReviews] = useState<Review[]>([])
  
  useEffect(() => {
    // Filter reviews for this tool
    setToolReviews(reviews.filter(review => review.toolId === tool.id))
  }, [tool.id])
  
  const handleSubmitReview = (reviewData: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'date' | 'likes'>) => {
    // In a real app, this would send the review to a backend
    console.log("Submitting review:", reviewData)
    // For demo purposes, we'll just add it to our local state
    const newReview: Review = {
      id: String(Date.now()),
      ...reviewData,
      userId: "currentUser",
      userName: "Current User",
      userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      date: new Date().toISOString().split('T')[0],
      likes: 0
    }
    setToolReviews([newReview, ...toolReviews])
  }
  
  const handleLikeReview = (reviewId: string) => {
    setToolReviews(reviews => 
      reviews.map(review => 
        review.id === reviewId 
          ? { ...review, likes: review.likes + 1 } 
          : review
      )
    )
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl mr-4">
                  <img src={tool.imageUrl} alt={tool.name} className="w-14 h-14" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium">
                      {tool.category}
                    </span>
                    <div className="flex items-center ml-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{tool.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-colors duration-200"
                aria-label="Close details"
                title="Close details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-6">
              <div className="md:col-span-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{tool.description}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Compatible Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.framework.map((fw, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Ratings</h3>
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{tool.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => r.toolId === tool.id && Math.floor(r.rating) === star).length;
                      const percentage = toolReviews.length > 0 
                        ? (count / toolReviews.length) * 100 
                        : 0;
                      
                      return (
                        <div key={star} className="flex items-center">
                          <div className="flex items-center mr-2">
                            {star} <svg className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 w-10 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Based on {tool.reviewCount} reviews</span>
                      <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">See all</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Reviews</h3>
              <ReviewForm toolId={tool.id} onSubmit={handleSubmitReview} />
              
              <div className="space-y-4">
                {toolReviews.length > 0 ? (
                  toolReviews.map(review => (
                    <div key={review.id}>
                      <ReviewCard review={review} onLike={handleLikeReview} />
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No reviews yet</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Be the first to review this tool!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Comment out the unused FilterBar component
// const FilterBar = ({ 
//   categories, 
//   frameworks, 
//   selectedCategory, 
//   selectedFramework, 
//   onCategoryChange, 
//   onFrameworkChange,
//   onClearFilters
// }: { 
//   categories: string[]
//   frameworks: string[]
//   selectedCategory: string
//   selectedFramework: string
//   onCategoryChange: (category: string) => void
//   onFrameworkChange: (framework: string) => void
//   onClearFilters: () => void
// }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
//         {(selectedCategory || selectedFramework) && (
//           <button 
//             onClick={onClearFilters}
//             className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
//           >
//             Clear filters
//           </button>
//         )}
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Category
//           </label>
//           <div className="relative">
//             <select
//               id="category"
//               className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
//               value={selectedCategory}
//               onChange={(e) => onCategoryChange(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>
//         <div>
//           <label htmlFor="framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Framework
//           </label>
//           <div className="relative">
//             <select
//               id="framework"
//               className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
//               value={selectedFramework}
//               onChange={(e) => onFrameworkChange(e.target.value)}
//             >
//               <option value="">All Frameworks</option>
//               {frameworks.map((framework) => (
//                 <option key={framework} value={framework}>
//                   {framework}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function ProgrammingToolsHub() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedFramework, setSelectedFramework] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Extract unique categories and frameworks from tools
  const categories = Array.from(new Set(tools.map(tool => tool.category)))
  const frameworks = Array.from(new Set(tools.flatMap(tool => tool.framework)))
  
  // Filter tools based on selected category, framework, and search query
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === "" || tool.category === selectedCategory
    const matchesFramework = selectedFramework === "" || tool.framework.includes(selectedFramework)
    const matchesSearch = searchQuery === "" || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesFramework && matchesSearch
  })

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedFramework("")
    setSearchQuery("")
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:flex-1 relative">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
              placeholder="Search tools, frameworks, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex md:w-2/3 gap-4">
            <div className="flex-1 relative">
              <select
                id="category"
                className="w-full pl-3 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                title="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <select
                id="framework"
                className="w-full pl-3 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white appearance-none"
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                aria-label="Filter by framework"
                title="Filter by framework"
              >
                <option value="">All Frameworks</option>
                {frameworks.map((framework) => (
                  <option key={framework} value={framework}>
                    {framework}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {(selectedCategory || selectedFramework || searchQuery) && (
              <button 
                onClick={clearFilters}
                className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-300 flex items-center"
                aria-label="Clear all filters"
                title="Clear all filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-12 w-12 mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 mr-1"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} onSelect={setSelectedTool} />
              ))}
            </div>
            
            {filteredTools.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No tools found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search query</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </>
        )}
        
        {selectedTool && (
          <ToolDetail tool={selectedTool} onClose={() => setSelectedTool(null)} />
        )}
      </div>
    </div>
  )
}
