import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define TypeScript interfaces
interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

interface Reaction {
  like: number;
  dislike: number;
}

interface Review {
  id: number;
  title: string;
  tool: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  comments: Comment[];
  reactions: Reaction;
}

interface NewReview {
  title: string;
  tool: string;
  rating: number;
  content: string;
}

interface UserReactions {
  [key: number]: {
    like: boolean;
    dislike: boolean;
  };
}

const ProgrammingToolsReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [newReview, setNewReview] = useState<NewReview>({
    title: '',
    tool: '',
    rating: 5,
    content: '',
  });
  const [activeReview, setActiveReview] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);
  const [userReactions, setUserReactions] = useState<UserReactions>({});

  useEffect(() => {
    // Mock data
    const mockReviews: Review[] = [
      {
        id: 1,
        title: 'React is amazing!',
        tool: 'React',
        author: 'dev123',
        rating: 5,
        content: 'React has completely transformed how I build user interfaces. The component-based architecture makes code so much more maintainable.',
        date: '2023-10-15',
        comments: [
          { id: 1, author: 'user456', content: 'I totally agree!', date: '2023-10-16' },
          { id: 2, author: 'webdev', content: 'Have you tried Vue?', date: '2023-10-17' },
        ],
        reactions: { like: 12, dislike: 2 },
      },
      {
        id: 2,
        title: 'Vue - simple and elegant',
        tool: 'Vue',
        author: 'frontend_guru',
        rating: 4,
        content: 'Vue provides a great balance between power and simplicity. The documentation is excellent and the learning curve is gentle.',
        date: '2023-10-10',
        comments: [],
        reactions: { like: 8, dislike: 1 },
      },
      {
        id: 3,
        title: 'Angular is powerful but complex',
        tool: 'Angular',
        author: 'fullstack_dev',
        rating: 3,
        content: 'Angular has everything you need out of the box, but the learning curve is steep. Great for large applications though.',
        date: '2023-10-05',
        comments: [
          { id: 3, author: 'angular_fan', content: 'It gets easier with practice!', date: '2023-10-06' },
        ],
        reactions: { like: 5, dislike: 3 },
      },
    ];
    setReviews(mockReviews);
    
    // Initialize userReactions object
    const initialReactions: UserReactions = {};
    mockReviews.forEach(review => {
      initialReactions[review.id] = { like: false, dislike: false };
    });
    setUserReactions(initialReactions);
  }, []);

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.tool.toLowerCase() === filter.toLowerCase());

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newReviewObj: Review = {
      id: reviews.length + 1,
      title: newReview.title,
      tool: newReview.tool,
      author: 'current_user',
      rating: newReview.rating,
      content: newReview.content,
      date: new Date().toISOString().split('T')[0],
      comments: [],
      reactions: { like: 0, dislike: 0 },
    };
    setReviews([newReviewObj, ...reviews]);
    
    // Add to userReactions
    setUserReactions(prev => ({
      ...prev,
      [newReviewObj.id]: { like: false, dislike: false }
    }));
    
    // Reset form and close modal
    setNewReview({ title: '', tool: '', rating: 5, content: '' });
    setShowAddReviewModal(false);
  };

  const handleAddComment = (reviewId: number) => {
    if (!comment.trim()) return;
    
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: [
            ...review.comments,
            {
              id: review.comments.length + 1,
              author: 'current_user',
              content: comment,
              date: new Date().toISOString().split('T')[0],
            }
          ]
        };
      }
      return review;
    });
    
    setReviews(updatedReviews);
    setComment('');
    setActiveReview(null);
  };

  const handleAddReaction = (reviewId: number, reactionType: 'like' | 'dislike') => {
    // Get current reaction states
    const currentUserReactions = userReactions[reviewId];
    const oppositeReaction = reactionType === 'like' ? 'dislike' : 'like';
    
    // Update user reactions state
    const newUserReactions = {
      ...userReactions,
      [reviewId]: {
        ...currentUserReactions,
        [reactionType]: !currentUserReactions[reactionType],
        [oppositeReaction]: false // Remove opposite reaction if present
      }
    };
    setUserReactions(newUserReactions);
    
    // Update review reactions count
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        const updatedReactions = { ...review.reactions };
        
        // If toggling on, increment
        if (!currentUserReactions[reactionType]) {
          updatedReactions[reactionType]++;
        } 
        // If toggling off, decrement
        else {
          updatedReactions[reactionType]--;
        }
        
        // If had opposite reaction before, decrement it
        if (currentUserReactions[oppositeReaction]) {
          updatedReactions[oppositeReaction]--;
        }
        
        return {
          ...review,
          reactions: updatedReactions
        };
      }
      return review;
    });
    
    setReviews(updatedReviews);
  };
  
  // Add smooth scroll function
  const scrollToReviews = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const reviewsSection = document.getElementById('reviews');
    reviewsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Programming Tools Reviews</title>
        <meta name="description" content="Share and read reviews about programming tools and frameworks" />
        <style>{`
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </Head>

      {/* Hero Section - now merged with content */}
      <section className="bg-gray-900 text-white h-screen flex items-center">
        <div className="relative overflow-hidden w-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-indigo-500"
                  style={{
                    width: `${Math.random() * 10 + 2}rem`,
                    height: `${Math.random() * 10 + 2}rem`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.1,
                    filter: 'blur(20px)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 py-10 md:py-20 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block mb-4 md:mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl">
                <div className="bg-gray-900 rounded-lg px-3 py-1 text-white font-medium">
                  Developer Community
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl md:p-[10px] font-extrabold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Find the Perfect Tools for Your Next Project
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
                Join our community of developers sharing experiences with frameworks, libraries, and tools. Discover what works best for your tech stack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowAddReviewModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25 font-medium flex items-center justify-center"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Share Your Experience
                </button>
                <a 
                  href="#reviews"
                  onClick={scrollToReviews}
                  className="bg-gray-800 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-gray-700 transition-all border border-gray-700 font-medium flex items-center justify-center"
                >
                  Browse Reviews
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div className="mt-8 md:mt-12 flex items-center justify-center flex-wrap gap-4 md:gap-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs text-white font-medium">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="ml-2 md:ml-4 text-gray-400 text-xs md:text-sm">
                    Join 2,500+ developers
                  </div>
                </div>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-300 text-xs md:text-sm">4.9/5 from 350+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 

      {/* Main content - seamlessly merged with hero */}
      <main id="reviews" className="container mx-auto px-4 pt-8 pb-16 relative -mt-16">
        <div className="bg-gray-900/50 backdrop-blur-md p-4 md:p-8 rounded-2xl border border-gray-800 shadow-xl mb-10">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {filter === 'all' ? 'All Reviews' : `${filter} Reviews`}
            </h2>
            <button 
              onClick={() => setShowAddReviewModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25 font-medium flex items-center text-sm md:text-base"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Review
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Sidebar with filters - Select on mobile, buttons on desktop */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8 lg:mb-0 lg:sticky lg:top-4 backdrop-blur-sm bg-opacity-70">
                <h2 className="text-xl font-semibold mb-4 text-white">Filter Reviews</h2>
                
                {/* Mobile Select Dropdown */}
                <div className="block lg:hidden mb-2">
                  <label htmlFor="mobile-filter" className="sr-only">Filter reviews by framework</label>
                  <select 
                    id="mobile-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Tools</option>
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                    <option value="svelte">Svelte</option>
                  </select>
                </div>
                
                {/* Desktop Filter Buttons */}
                <div className="hidden lg:block space-y-2">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === 'all' 
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-gray-700/40 hover:bg-gray-700/60 border-l-4 border-transparent'
                    }`}
                    type="button"
                  >
                    All Tools
                  </button>
                  <button 
                    onClick={() => setFilter('react')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === 'react' 
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-gray-700/40 hover:bg-gray-700/60 border-l-4 border-transparent'
                    }`}
                    type="button"
                  >
                    React
                  </button>
                  <button 
                    onClick={() => setFilter('vue')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === 'vue' 
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-gray-700/40 hover:bg-gray-700/60 border-l-4 border-transparent'
                    }`}
                    type="button"
                  >
                    Vue
                  </button>
                  <button 
                    onClick={() => setFilter('angular')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === 'angular' 
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-gray-700/40 hover:bg-gray-700/60 border-l-4 border-transparent'
                    }`}
                    type="button"
                  >
                    Angular
                  </button>
                  <button 
                    onClick={() => setFilter('svelte')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === 'svelte' 
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-gray-700/40 hover:bg-gray-700/60 border-l-4 border-transparent'
                    }`}
                    type="button"
                  >
                    Svelte
                  </button>
                </div>
              </div>
            </div>

            {/* Main content with reviews - Dark themed */}
            <div className="lg:col-span-3">
              {filteredReviews.length === 0 ? (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center backdrop-blur-sm bg-opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-base md:text-lg">No reviews found for this filter.</p>
                  <button 
                    onClick={() => setShowAddReviewModal(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    type="button"
                  >
                    Be the first to add a review
                  </button>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {filteredReviews.map(review => (
                    <div 
                      key={review.id} 
                      className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all backdrop-blur-sm bg-opacity-70 hover:shadow-indigo-500/10 relative overflow-hidden group"
                    >
                      {/* Decorative gradient blob */}
                      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-70"></div>
                      
                      <div className="relative">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h3 className="text-lg md:text-xl font-semibold mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">{review.title}</h3>
                            <div className="flex items-center flex-wrap gap-2 mb-2 md:mb-3">
                              <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-0.5 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-indigo-800/40 to-purple-800/40 text-indigo-300 border border-indigo-700/50">
                                {review.tool}
                              </span>
                              <span className="text-xs md:text-sm text-gray-400">
                                By {review.author} • {review.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 md:w-5 md:h-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-600'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6">{review.content}</p>
                        
                        <div className="flex items-center space-x-4 md:space-x-6 mb-4 border-t border-gray-700 pt-4">
                          <button 
                            onClick={() => handleAddReaction(review.id, 'like')}
                            className={`flex items-center space-x-1 ${
                              userReactions[review.id]?.like 
                                ? 'text-indigo-400 font-medium' 
                                : 'text-gray-400 hover:text-indigo-400'
                            }`}
                            type="button"
                          >
                            <svg className="w-5 h-5" fill={userReactions[review.id]?.like ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>{review.reactions.like}</span>
                          </button>
                          <button 
                            onClick={() => handleAddReaction(review.id, 'dislike')}
                            className={`flex items-center space-x-1 ${
                              userReactions[review.id]?.dislike 
                                ? 'text-pink-500 font-medium' 
                                : 'text-gray-400 hover:text-pink-500'
                            }`}
                            type="button"
                          >
                            <svg className="w-5 h-5" fill={userReactions[review.id]?.dislike ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                            </svg>
                            <span>{review.reactions.dislike}</span>
                          </button>
                          <button 
                            onClick={() => setActiveReview(activeReview === review.id ? null : review.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400"
                            type="button"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span>{review.comments.length} {review.comments.length === 1 ? 'comment' : 'comments'}</span>
                          </button>
                        </div>
                        
                        {activeReview === review.id && (
                          <div className="border-t border-gray-700 pt-4 mt-4">
                            <h4 className="font-semibold mb-4 text-sm md:text-base text-gray-200">Comments</h4>
                            
                            {review.comments.length > 0 ? (
                              <div className="space-y-3 md:space-y-4 mb-4">
                                {review.comments.map(comment => (
                                  <div key={comment.id} className="bg-gray-700/50 p-3 md:p-4 rounded-lg border border-gray-600">
                                    <div className="flex justify-between text-xs md:text-sm mb-1">
                                      <span className="font-medium text-indigo-400">{comment.author}</span>
                                      <span className="text-gray-400">{comment.date}</span>
                                    </div>
                                    <p className="text-gray-300 text-xs md:text-sm">{comment.content}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 mb-4 italic text-xs md:text-sm">No comments yet. Be the first to comment!</p>
                            )}
                            
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-3 md:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                              />
                              <button
                                onClick={() => handleAddComment(review.id)}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors text-sm"
                                type="button"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Review Modal - Dark themed */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Add a Review</h2>
              <button 
                onClick={() => setShowAddReviewModal(false)}
                className="text-gray-400 hover:text-gray-200"
                type="button"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Review Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  placeholder="e.g. My experience with React"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tool" className="block text-sm font-medium text-gray-300 mb-1">
                  Tool/Framework
                </label>
                <input
                  type="text"
                  id="tool"
                  required
                  value={newReview.tool}
                  onChange={(e) => setNewReview({...newReview, tool: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  placeholder="e.g. React, Vue, Angular"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center">
                  {[5, 4, 3, 2, 1].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="mr-1 focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <svg 
                        className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-600'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-gray-300">{newReview.rating} {newReview.rating === 1 ? 'Star' : 'Stars'}</span>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Review Content
                </label>
                <textarea
                  id="content"
                  required
                  rows={5}
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                  placeholder="Share your experience with this tool or framework..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammingToolsReview;