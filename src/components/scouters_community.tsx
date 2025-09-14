'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

// Define types
interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  nationality: string;
  height: string;
  weight: string;
  stats: PlayerStats;
  bio: string;
  image: string;
  videos: string[];
  highlights: string[];
}

interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

interface Agent {
  id: string;
  name: string;
  agency: string;
  players: string[];
  bio: string;
  image: string;
  contact: string;
}

interface Post {
  id: string;
  authorId: string;
  authorType: 'player' | 'agent';
  content: string;
  media?: string[];
  timestamp: number;
  likes: number;
  comments: Comment[];
  userLiked?: boolean; // Added userLiked property
}

interface Comment {
  id: string;
  authorId: string;
  authorType: 'player' | 'agent' | 'scout';
  content: string;
  timestamp: number;
}

// Define extended types to fix type errors
interface PlayerWithType extends Player {
  type: 'player';
}

interface AgentWithType extends Agent {
  type: 'agent';
}

type ProfileWithType = PlayerWithType | AgentWithType;

// Sample data (in a real app, this would come from a database)
const samplePlayers: Player[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    position: 'Forward',
    age: 22,
    club: 'Manchester FC',
    nationality: 'England',
    height: '185cm',
    weight: '78kg',
    stats: {
      pace: 88,
      shooting: 85,
      passing: 79,
      dribbling: 86,
      defending: 45,
      physical: 72
    },
    bio: 'Rising star with exceptional pace and shooting ability.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    videos: ['https://example.com/video1', 'https://example.com/video2'],
    highlights: ['Scored 15 goals last season', 'Youth academy graduate']
  },
  {
    id: '2',
    name: 'Carlos Mendez',
    position: 'Midfielder',
    age: 24,
    club: 'Barcelona FC',
    nationality: 'Spain',
    height: '175cm',
    weight: '68kg',
    stats: {
      pace: 76,
      shooting: 70,
      passing: 91,
      dribbling: 89,
      defending: 65,
      physical: 68
    },
    bio: 'Creative midfielder with extraordinary vision and passing range.',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
    videos: ['https://example.com/video3', 'https://example.com/video4'],
    highlights: ['Most assists in the league', 'National team debut last year']
  },
  {
    id: '3',
    name: 'Marcus Williams',
    position: 'Defender',
    age: 26,
    club: 'Liverpool FC',
    nationality: 'England',
    height: '190cm',
    weight: '85kg',
    stats: {
      pace: 72,
      shooting: 45,
      passing: 74,
      dribbling: 65,
      defending: 88,
      physical: 86
    },
    bio: 'Dominant center-back known for aerial ability and leadership.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    videos: ['https://example.com/video5', 'https://example.com/video6'],
    highlights: ['Clean sheet record', 'Captain of the team']
  }
];

const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Parker',
    agency: 'Elite Sports Management',
    players: ['1', '3'],
    bio: 'Experienced agent with a strong network across European clubs.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    contact: 'sarah@elitesm.com'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    agency: 'Global Talent Agency',
    players: ['2'],
    bio: 'Specializing in South American talent development and placement.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    contact: 'michael@globaltalent.com'
  }
];

const samplePosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    authorType: 'player',
    content: 'Just finished an intense training session. Working on my finishing!',
    media: ['https://images.unsplash.com/photo-1508098682722-e99c643e7f76'],
    timestamp: Date.now() - 1000000,
    likes: 124,
    comments: [
      {
        id: '1',
        authorId: '2',
        authorType: 'agent',
        content: 'Great work! Keep it up!',
        timestamp: Date.now() - 900000
      }
    ]
  },
  {
    id: '2',
    authorId: '2',
    authorType: 'agent',
    content: 'Excited to announce Carlos has signed with Barcelona FC! Big things ahead.',
    media: ['https://images.unsplash.com/photo-1522778526097-ce0a22ceb253'],
    timestamp: Date.now() - 2000000,
    likes: 256,
    comments: []
  },
  {
    id: '3',
    authorId: '3',
    authorType: 'player',
    content: 'Match day! Ready to give everything for the team.',
    media: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018'],
    timestamp: Date.now() - 500000,
    likes: 310,
    comments: []
  }
];

// Add more sample posts
const additionalPosts: Post[] = [
  {
    id: '4',
    authorId: '2',
    authorType: 'player',
    content: 'Just signed with a new club! Excited for this next chapter in my career. The training facilities are amazing and the team has been very welcoming.',
    media: ['https://images.unsplash.com/photo-1517927033932-b3d18e61fb21'],
    timestamp: Date.now() - 300000,
    likes: 428,
    comments: [
      {
        id: '2',
        authorId: '1',
        authorType: 'agent',
        content: 'Congratulations! This is great news.',
        timestamp: Date.now() - 250000
      },
      {
        id: '3',
        authorId: '3',
        authorType: 'player',
        content: 'Can\'t wait to play against you!',
        timestamp: Date.now() - 200000
      }
    ]
  },
  {
    id: '5',
    authorId: '3',
    authorType: 'player',
    content: 'Training session today was intense. Working on defensive positioning and aerial duels. Always trying to improve every aspect of my game.',
    media: ['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d'],
    timestamp: Date.now() - 800000,
    likes: 215,
    comments: []
  },
  {
    id: '6',
    authorId: '1',
    authorType: 'agent',
    content: 'Just watched one of my youngest clients make his professional debut. So proud of his journey from academy to first team. Hard work pays off!',
    timestamp: Date.now() - 1500000,
    likes: 189,
    comments: [
      {
        id: '4',
        authorId: '2', 
        authorType: 'agent',
        content: 'It\'s a great feeling to see them succeed!',
        timestamp: Date.now() - 1400000
      }
    ]
  },
  {
    id: '7',
    authorId: '3',
    authorType: 'player',
    content: 'Match highlights from yesterday. We secured a crucial win in the championship race! Great team effort from everyone.',
    media: ['https://images.unsplash.com/photo-1577223625816-6e761c7b2e1d'],
    timestamp: Date.now() - 100000,
    likes: 356,
    comments: [
      {
        id: '5',
        authorId: '1',
        authorType: 'player',
        content: 'Incredible performance from the whole team!',
        timestamp: Date.now() - 90000
      }
    ]
  },
  {
    id: '8',
    authorId: '2',
    authorType: 'agent',
    content: 'Transfer window is closing soon. Expect some exciting announcements in the coming days! Stay tuned. #TransferNews',
    timestamp: Date.now() - 400000,
    likes: 278,
    comments: []
  },
  {
    id: '9',
    authorId: '1',
    authorType: 'player',
    content: 'Recovery day. Ice bath, massage therapy, and proper nutrition are key for staying in top condition throughout a demanding season.',
    media: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf'],
    timestamp: Date.now() - 600000,
    likes: 421,
    comments: [
      {
        id: '6',
        authorId: '2',
        authorType: 'agent',
        content: 'Recovery is just as important as training! Keep taking care of your body.',
        timestamp: Date.now() - 550000
      }
    ]
  },
  {
    id: '10',
    authorId: '2',
    authorType: 'player',
    content: 'Analyzing match footage with the coaching staff. Always learning and finding ways to improve. Football is as much about the mental game as it is physical.',
    media: ['https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c'],
    timestamp: Date.now() - 950000,
    likes: 315,
    comments: []
  },
  {
    id: '11',
    authorId: '3',
    authorType: 'player',
    content: 'Community outreach day with the club. Visited a local school to talk about pursuing dreams and the importance of education alongside sports. These kids inspire me!',
    media: ['https://images.unsplash.com/photo-1611189085248-12e4587e6e24'],
    timestamp: Date.now() - 1100000,
    likes: 503,
    comments: [
      {
        id: '7',
        authorId: '1',
        authorType: 'agent',
        content: 'This is amazing! So important to give back to the community.',
        timestamp: Date.now() - 1050000
      }
    ]
  },
  {
    id: '12',
    authorId: '1',
    authorType: 'agent',
    content: 'Attending a youth tournament this weekend to scout emerging talent. The future of football looks bright!',
    timestamp: Date.now() - 1800000,
    likes: 167,
    comments: []
  }
];

// Filter types
type PositionFilter = 'All' | 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
type AgeFilter = 'All' | 'U20' | '20-25' | '26-30' | '30+';
type ProfileType = 'All' | 'Players' | 'Agents';

// Adding a FollowButton component to isolate the follow functionality
const FollowButton: React.FC<{
  profileId: string;
  className?: string;
}> = ({ profileId: _profileId, className }) => {
  // Renamed parameter with underscore prefix to satisfy linter
  const [isFollowing, setIsFollowing] = useState(false);
  
  const toggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove console.log to fix linting error
    setIsFollowing(prev => !prev);
  };
  
  return (
    <button 
      onClick={toggleFollow}
      className={`${className} ${
        isFollowing
          ? 'bg-emerald-500 text-white'
          : 'bg-slate-600 text-white hover:bg-slate-500'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

// Add this component before the main ScoutersCommunity component
// Extract Post Card to a separate component for better maintainability
const PostCard: React.FC<{
  post: Post;
  openPostModal: (post: Post) => void;
  likePost: (postId: string) => void;
  getAuthorName: (id: string, type: 'player' | 'agent') => string;
  getAuthorImage: (id: string, type: 'player' | 'agent') => string;
  formatTime: (timestamp: number) => string;
  onProfileClick: (authorId: string, authorType: 'player' | 'agent') => void;
  index: number;
}> = ({ 
  post, 
  openPostModal, 
  likePost, 
  getAuthorName, 
  getAuthorImage, 
  formatTime, 
  onProfileClick,
  index
}) => {
  return (
    <div 
      key={post.id} 
      className="bg-slate-700/80 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-600/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-lg shadow-md flex flex-col animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => openPostModal(post)}
    >
      {/* Post Header */}
      <div className="p-4 flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/20 cursor-pointer relative"
          onClick={(e) => {
            e.stopPropagation();
            onProfileClick(post.authorId, post.authorType);
          }}
        >
          <Image 
            src={getAuthorImage(post.authorId, post.authorType)} 
            alt={getAuthorName(post.authorId, post.authorType)}
            className="object-cover"
            fill
            sizes="40px"
          />
        </div>
        <div>
          <div className="text-white font-medium">
            {getAuthorName(post.authorId, post.authorType)}
          </div>
          <div className="text-slate-400 text-xs">
            {formatTime(post.timestamp)}
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-3 flex-grow">
        <p className="text-blue-100 line-clamp-3">{post.content}</p>
      </div>
      
      {/* Post Media - Fixed height regardless of content */}
      <div className="w-full h-48 overflow-hidden relative">
        {post.media && post.media.length > 0 ? (
          <Image 
            src={post.media[0]} 
            alt="Post media" 
            className="object-cover"
            fill
            sizes="100%"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      
      {/* Post Actions - Fixed like and comment functionality */}
      <div className="px-4 py-3 border-t border-slate-600 flex justify-between">
        <button 
          className={`flex items-center ${post.userLiked ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-400'} transition-colors`}
          onClick={(e) => {
            e.stopPropagation();
            likePost(post.id);
          }}
          aria-label="Like post"
        >
          <svg className={`w-5 h-5 mr-1 ${post.userLiked ? 'fill-emerald-500 text-emerald-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span>{post.likes}</span>
        </button>
        <button 
          className="text-slate-400 flex items-center hover:text-emerald-400"
          onClick={(e) => {
            e.stopPropagation();
            openPostModal(post);
          }}
          aria-label="Show comments"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span>{post.comments.length}</span>
        </button>
      </div>
    </div>
  );
};

// Main component
const ScoutersCommunity: React.FC = () => {
  // State management
  const [players] = useState<Player[]>(samplePlayers);
  const [agents] = useState<Agent[]>(sampleAgents);
  const [posts, setPosts] = useState<Post[]>([...samplePosts, ...additionalPosts]);
  const [activeTab, setActiveTab] = useState<'feed' | 'players' | 'messages'>('feed');
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithType | null>(null);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('All');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('All');
  const [profileTypeFilter, setProfileTypeFilter] = useState<ProfileType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [_activeConversation, setActiveConversation] = useState<string | null>(null);
  
  // Post Modal State
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<string>('');
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Comment state
  const [newCommentText, setNewCommentText] = useState('');
  
  // Add ref for feed section
  const feedSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to feed section
  const scrollToFeed = () => {
    feedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab('feed');
    setSelectedProfile(null);
  };
  
  // Function to handle new post submission
  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `${Date.now()}`,
      authorId: 'user',
      authorType: 'player', // Assuming user is a player for demo
      content: newPostContent,
      media: newPostMedia ? [newPostMedia] : undefined,
      timestamp: Date.now(),
      likes: 0,
      comments: []
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostMedia('');
    setShowAddPostModal(false);
  };
  
  // Function to like a post - modified to track user likes
  const likePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.userLiked ? post.likes - 1 : post.likes + 1,
            userLiked: !post.userLiked
          } 
        : post
    ));
  };
  
  // Function to add a new comment to a post
  const addCommentToPost = (postId: string) => {
    if (!newCommentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      authorId: 'user', // Assuming user is commenting
      authorType: 'scout',
      content: newCommentText,
      timestamp: Date.now()
    };
    
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] } 
        : post
    ));
    
    setNewCommentText('');
  };
  
  // Function to open post modal
  const openPostModal = (post: Post) => {
    setActivePost(post);
    setShowPostModal(true);
  };
  
  // Function to close post modal
  const closePostModal = () => {
    setActivePost(null);
    setShowPostModal(false);
  };

  // Get author name from ID
  const getAuthorName = (id: string, type: 'player' | 'agent'): string => {
    if (type === 'player') {
      const player = players.find(p => p.id === id);
      return player ? player.name : 'Unknown Player';
    } else {
      const agent = agents.find(a => a.id === id);
      return agent ? agent.name : 'Unknown Agent';
    }
  };

  // Get author image from ID
  const getAuthorImage = (id: string, type: 'player' | 'agent'): string => {
    if (type === 'player') {
      const player = players.find(p => p.id === id);
      return player ? player.image : '';
    } else {
      const agent = agents.find(a => a.id === id);
      return agent ? agent.image : '';
    }
  };

  // Format timestamp - Using consistent date format to avoid hydration errors
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    // Using a specific format that will be consistent between server and client
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Filter players based on current filters
  const filteredPlayers = players.filter(player => {
    // Position filter
    if (positionFilter !== 'All' && player.position !== positionFilter) {
      return false;
    }
    
    // Age filter
    if (ageFilter !== 'All') {
      if (ageFilter === 'U20' && player.age >= 20) return false;
      if (ageFilter === '20-25' && (player.age < 20 || player.age > 25)) return false;
      if (ageFilter === '26-30' && (player.age < 26 || player.age > 30)) return false;
      if (ageFilter === '30+' && player.age <= 30) return false;
    }
    
    // Search query
    if (searchQuery !== '' && 
        !player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !player.club.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !player.nationality.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Filter agents based on current filters
  const filteredAgents = agents.filter(agent => {
    // Search query
    if (searchQuery !== '' && 
        !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !agent.agency.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Function to convert Player to PlayerWithType
  const playerToProfileWithType = (player: Player): PlayerWithType => ({
    ...player,
    type: 'player'
  });

  // Function to convert Agent to AgentWithType
  const agentToProfileWithType = (agent: Agent): AgentWithType => ({
    ...agent,
    type: 'agent'
  });

  // Update the getFilteredProfiles function to return the correct types
  const getFilteredProfiles = (): ProfileWithType[] => {
    const playerProfiles = profileTypeFilter === 'Players' || profileTypeFilter === 'All' 
      ? filteredPlayers.map(playerToProfileWithType)
      : [];
    
    const agentProfiles = profileTypeFilter === 'Agents' || profileTypeFilter === 'All'
      ? filteredAgents.map(agentToProfileWithType)
      : [];
    
    return [...playerProfiles, ...agentProfiles];
  };

  // Function to start messaging with a profile (simplified)
  const startMessagingWithProfile = (profile: ProfileWithType) => {
    // Just switch to messages tab for now
    const conversationId = profile.type === 'player' ? `player${profile.id}` : `agent${profile.id}`;
    setActiveConversation(conversationId);
    setActiveTab('messages');
  };

  // The component will be continued in the next parts
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900" style={{fontFamily: "'Poppins', sans-serif"}}>
      {/* New Hero Section */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 z-10"></div>
          <Image 
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Football Stadium" 
            className="object-cover"
            fill
            sizes="100vw"
            priority
          />
        </div>
        
        <div className="container mx-auto h-[100vh] py-16 md:py-24 px-4 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Discover & Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Football Talent</span>
            </h1>
            <p className="text-blue-200 text-xl md:text-2xl mb-8 font-light">
              The platform connecting scouts, players and agents in the global football ecosystem
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToFeed}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all transform hover:-translate-y-1 duration-200 font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Discover Players
              </button>
              {/* Connect with Agents button removed */}
            </div>
            
            {/* Stats display */}
            <div className="grid grid-cols-3 gap-4 mt-12 text-center">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">500+</div>
                <div className="text-blue-200 text-sm md:text-base">Active Players</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">150+</div>
                <div className="text-blue-200 text-sm md:text-base">Registered Agents</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">50+</div>
                <div className="text-blue-200 text-sm md:text-base">Clubs Connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 tracking-tight" style={{fontFamily: "'Poppins', sans-serif"}}>
            Football Talent Spotlight
          </h1>
          <p className="text-blue-200 mt-2 font-light">
            Connecting talent with opportunity in the world of football
          </p>
        </header>

        {/* Convert sidebar to top navigation bar - Enhanced with glass morphism effect */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 p-2 mb-6 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-1 md:space-x-4 pl-2">
            <button
              onClick={() => {
                setActiveTab('feed');
                setSelectedProfile(null);
              }}
              title="Feed"
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeTab === 'feed'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <span className="hidden md:inline ml-2 font-medium">Feed</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('players');
                setSelectedProfile(null);
              }}
              title="Profiles"
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeTab === 'players'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="hidden md:inline ml-2 font-medium">Profiles</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('messages');
                setSelectedProfile(null);
              }}
              title="Messages"
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeTab === 'messages'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <span className="hidden md:inline ml-2 font-medium">Messages</span>
            </button>
          </div>
          
          {/* Create Post Button - Enhanced with animation and glass effect */}
          <button
            onClick={() => setShowAddPostModal(true)}
            title="Create Post"
            className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-1 shadow-md flex items-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="hidden md:inline ml-2">Create Post</span>
          </button>
        </div>

        {/* Add Post Modal - Enhance with glass morphism */}
        {showAddPostModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddPostModal(false)}>
            <div 
              className="glass-card rounded-xl overflow-hidden max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-white font-medium">Create Post</h3>
                <button 
                  onClick={() => setShowAddPostModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
                  title="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full h-32 glass-input rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-slate-300 text-sm font-medium mb-2">Add Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={newPostMedia}
                    onChange={(e) => setNewPostMedia(e.target.value)}
                    className="w-full glass-input rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleAddPost}
                    disabled={!newPostContent.trim()}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="rounded-xl overflow-hidden">
          {/* Search and Post Creation Bar - Removed as it's replaced by the create post button */}

          {/* Messages section - Simplified placeholder */}
          {activeTab === 'messages' && (
            <div className="glass-card rounded-xl overflow-hidden shadow-lg">
              <div className="h-[70vh] flex">
                {/* Left sidebar - Placeholder */}
                <div className="w-1/3 border-r border-slate-700">
                  <h2 className="p-4 border-b border-slate-700 text-white font-medium">Messages</h2>
                  <div className="p-4 text-slate-400">
                    <p>Messaging functionality will be implemented in the next update.</p>
                  </div>
                </div>
                
                {/* Right side - Placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-white font-medium text-lg mb-2">Your Messages</h3>
                  <p className="text-slate-400 max-w-md mb-6">
                    Messaging functionality will be added in the next version.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feed Section - Add ref for scrolling */}
          {activeTab === 'feed' && (
            <div ref={feedSectionRef} className="bg-slate-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 p-4 shadow-lg">
              <h2 className="text-xl text-white font-medium mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                Latest Updates
              </h2>
              
              {/* Grid Layout with 3 posts per row - Enhanced with animations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    openPostModal={openPostModal}
                    likePost={likePost}
                    getAuthorName={getAuthorName}
                    getAuthorImage={getAuthorImage}
                    formatTime={formatTime}
                    onProfileClick={(authorId, authorType) => {
                      // Find the profile and set it as selected
                      if (authorType === 'player') {
                        const player = players.find(p => p.id === authorId);
                        if (player) {
                          setSelectedProfile(playerToProfileWithType(player));
                          setActiveTab('players');
                        }
                      } else {
                        const agent = agents.find(a => a.id === authorId);
                        if (agent) {
                          setSelectedProfile(agentToProfileWithType(agent));
                          setActiveTab('players');
                        }
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters - Updated layout */}
          {activeTab !== 'messages' && activeTab !== 'feed' && (
            <div className="glass-card rounded-xl p-4 mb-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar - Reduced size */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for players, agents, clubs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 p-2 pl-8 glass-input rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <svg 
                      className="w-4 h-4 text-slate-400 absolute left-2 top-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filters */}
                {activeTab === 'players' && (
                  <div className="flex flex-wrap gap-2">
                    <select
                      aria-label="Filter by profile type"
                      title="Filter by profile type"
                      value={profileTypeFilter}
                      onChange={(e) => setProfileTypeFilter(e.target.value as ProfileType)}
                      className="h-10 p-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                      <option value="All">All Profiles</option>
                      <option value="Players">Players</option>
                      <option value="Agents">Agents</option>
                    </select>
                    
                    {(profileTypeFilter === 'Players' || profileTypeFilter === 'All') && (
                      <>
                        <select
                          aria-label="Filter by position"
                          title="Filter by position"
                          value={positionFilter}
                          onChange={(e) => setPositionFilter(e.target.value as PositionFilter)}
                          className="h-10 p-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        >
                          <option value="All">All Positions</option>
                          <option value="Forward">Forwards</option>
                          <option value="Midfielder">Midfielders</option>
                          <option value="Defender">Defenders</option>
                          <option value="Goalkeeper">Goalkeepers</option>
                        </select>
                        
                        <select
                          aria-label="Filter by age"
                          title="Filter by age"
                          value={ageFilter}
                          onChange={(e) => setAgeFilter(e.target.value as AgeFilter)}
                          className="h-10 p-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        >
                          <option value="All">All Ages</option>
                          <option value="U20">Under 20</option>
                          <option value="20-25">20-25</option>
                          <option value="26-30">26-30</option>
                          <option value="30+">Over 30</option>
                        </select>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Profiles grid view */}
          {activeTab === 'players' && !selectedProfile && (
            <div className="glass-card rounded-xl overflow-hidden p-4 shadow-lg">
              <h2 className="text-xl text-white font-medium mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {profileTypeFilter === 'All' ? 'All Profiles' : 
                 profileTypeFilter === 'Players' ? 'Player Profiles' : 'Agent Profiles'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredProfiles().map((profile, index) => (
                  <div
                    key={`${profile.type}-${profile.id}`}
                    className="glass-card rounded-lg overflow-hidden hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div 
                      className="h-40 overflow-hidden"
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <img 
                        src={profile.image} 
                        alt={profile.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 
                          className="text-white font-medium cursor-pointer" 
                          onClick={() => setSelectedProfile(profile)}
                        >
                          {profile.name}
                        </h3>
                        <div className="px-2 py-1 bg-slate-600 text-emerald-400 rounded text-xs">
                          {profile.type === 'player' ? profile.position : 'Agent'}
                        </div>
                      </div>
                      
                      <div 
                        className="text-slate-400 text-sm mb-4 cursor-pointer" 
                        onClick={() => setSelectedProfile(profile)}
                      >
                        {profile.type === 'player' 
                          ? `${profile.age} years • ${profile.club}` 
                          : profile.agency}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <FollowButton 
                          profileId={profile.id}
                          className="px-3 py-1 rounded text-sm transition-colors"
                        />
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startMessagingWithProfile(profile);
                          }}
                          className="px-3 py-1 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Player Profile */}
          {activeTab === 'players' && selectedProfile && selectedProfile.type === 'player' && (
            <div className="glass-card rounded-xl overflow-hidden shadow-lg">
              {/* Header with back button */}
              <div className="p-4 border-b border-slate-700 flex items-center">
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Back to profiles"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <h2 className="text-white font-medium ml-2">Player Profile</h2>
              </div>
              
              {/* Profile content */}
              <div className="md:flex">
                {/* Left column - Personal info */}
                <div className="md:w-1/3 p-6 border-r border-slate-700">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-emerald-500/20 relative">
                      <Image 
                        src={selectedProfile.image} 
                        alt={selectedProfile.name} 
                        className="object-cover"
                        fill
                        sizes="128px"
                      />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{selectedProfile.name}</h1>
                    <div className="inline-block px-3 py-1 bg-slate-700 text-emerald-400 rounded-full text-sm">
                      {selectedProfile.position}
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-center sm:text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Club</span>
                      <span className="text-white font-medium">{selectedProfile.club}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Age</span>
                      <span className="text-white font-medium">{selectedProfile.age} years</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nationality</span>
                      <span className="text-white font-medium">{selectedProfile.nationality}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Height</span>
                      <span className="text-white font-medium">{selectedProfile.height}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weight</span>
                      <span className="text-white font-medium">{selectedProfile.weight}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-2">
                    <button 
                      onClick={() => startMessagingWithProfile(selectedProfile)}
                      className="flex-1 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Message
                    </button>
                    <FollowButton 
                      profileId={selectedProfile.id}
                      className="flex-1 py-2 rounded-lg transition-colors"
                    />
                  </div>
                </div>
                
                {/* Right column - Stats, biography, etc. */}
                <div className="md:w-2/3 p-6">
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-white mb-4">About</h2>
                    <p className="text-blue-100">{selectedProfile.bio}</p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-white mb-4">Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm">Pace</span>
                          <span className="text-white font-medium">{selectedProfile.stats.pace}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${selectedProfile.stats.pace}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm">Shooting</span>
                          <span className="text-white font-medium">{selectedProfile.stats.shooting}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${selectedProfile.stats.shooting}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm">Passing</span>
                          <span className="text-white font-medium">{selectedProfile.stats.passing}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${selectedProfile.stats.passing}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm">Dribbling</span>
                          <span className="text-white font-medium">{selectedProfile.stats.dribbling}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${selectedProfile.stats.dribbling}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm">Defending</span>
                          <span className="text-white font-medium">{selectedProfile.stats.defending}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${selectedProfile.stats.defending}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm">Physical</span>
                          <span className="text-white font-medium">{selectedProfile.stats.physical}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${selectedProfile.stats.physical}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium text-white mb-4">Highlights</h2>
                    <ul className="space-y-2">
                      {selectedProfile.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          <span className="text-blue-100">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Agent Profile */}
          {activeTab === 'players' && selectedProfile && selectedProfile.type === 'agent' && (
            <div className="glass-card rounded-xl overflow-hidden shadow-lg">
              {/* Header with back button */}
              <div className="p-4 border-b border-slate-700 flex items-center">
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Back to profiles"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <h2 className="text-white font-medium ml-2">Agent Profile</h2>
              </div>
              
              {/* Profile content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0 border-4 border-emerald-500/20 relative">
                    <Image 
                      src={selectedProfile.image} 
                      alt={selectedProfile.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-white mb-2">{selectedProfile.name}</h1>
                    <div className="inline-block px-3 py-1 bg-slate-700 text-emerald-400 rounded-full text-sm mb-4">
                      {selectedProfile.agency}
                    </div>
                    <p className="text-blue-100 mb-4">{selectedProfile.bio}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">Contact</div>
                        <div className="text-blue-100">
                          {selectedProfile.type === 'agent' ? selectedProfile.contact : 'N/A'}
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">Players Represented</div>
                        <div className="text-blue-100">
                          {selectedProfile.type === 'agent' ? selectedProfile.players.length : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-full md:w-auto mt-6 md:mt-0">
                    <button 
                      onClick={() => startMessagingWithProfile(selectedProfile)}
                      className="w-full mr-2 md:w-auto px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors mb-2"
                    >
                      Message
                    </button>
                    <FollowButton 
                      profileId={selectedProfile.id}
                      className="w-full md:w-auto px-6 py-3 rounded-lg transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-white mb-4">Players Represented</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProfile.type === 'agent' && selectedProfile.players.map((playerId: string) => {
                      const player = players.find(p => p.id === playerId);
                      if (!player) return null;
                      
                      return (
                        <div 
                          key={player.id}
                          onClick={() => setSelectedProfile(playerToProfileWithType(player))}
                          className="flex items-center space-x-4 bg-slate-700 p-3 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={player.image} 
                              alt={player.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-white font-medium">{player.name}</div>
                            <div className="text-slate-400 text-sm">{player.position} • {player.club}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post Modal */}
          {showPostModal && activePost && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={closePostModal}>
              <div 
                className="glass-card rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Post Header */}
                <div className="p-4 sticky top-0 bg-slate-800 border-b border-slate-700 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/20 cursor-pointer relative"
                      onClick={() => {
                        // Find the profile and set it as selected
                        if (activePost.authorType === 'player') {
                          const player = players.find(p => p.id === activePost.authorId);
                          if (player) {
                            setSelectedProfile(playerToProfileWithType(player));
                            setActiveTab('players');
                            closePostModal();
                          }
                        } else {
                          const agent = agents.find(a => a.id === activePost.authorId);
                          if (agent) {
                            setSelectedProfile(agentToProfileWithType(agent));
                            setActiveTab('players');
                            closePostModal();
                          }
                        }
                      }}
                    >
                      <Image 
                        src={getAuthorImage(activePost.authorId, activePost.authorType)} 
                        alt={getAuthorName(activePost.authorId, activePost.authorType)}
                        className="object-cover"
                        fill
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {getAuthorName(activePost.authorId, activePost.authorType)}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {formatTime(activePost.timestamp)}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={closePostModal}
                    className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors"
                    title="Close post"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="p-4">
                  <p className="text-blue-100 mb-6 text-lg">{activePost.content}</p>
                  
                  {/* Post Media - If available */}
                  {activePost.media && activePost.media.length > 0 && (
                    <div className="w-full h-64 mb-6 overflow-hidden rounded-lg relative">
                      <Image 
                        src={activePost.media[0]} 
                        alt="Post media" 
                        className="object-cover"
                        fill
                        sizes="100%"
                      />
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className="py-3 border-t border-b border-slate-700 flex justify-between mb-4">
                    <button 
                      className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors"
                      onClick={() => likePost(activePost.id)}
                    >
                      <svg className={`w-5 h-5 mr-1 ${activePost.userLiked ? 'fill-emerald-500 text-emerald-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{activePost.likes} likes</span>
                    </button>
                    <button 
                      className="text-slate-400 flex items-center hover:text-emerald-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPostModal(activePost);
                      }}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span>{activePost.comments.length} comments</span>
                    </button>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="mb-4">
                    <h3 className="text-white font-medium mb-3">Comments</h3>
                    
                    {activePost.comments.length === 0 ? (
                      <p className="text-slate-400 text-sm">No comments yet. Be the first to comment!</p>
                    ) : (
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                        {activePost.comments.map((comment) => (
                          <div key={comment.id} className="bg-slate-700 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-slate-600 overflow-hidden relative">
                                {comment.authorType !== 'scout' ? (
                                  <Image 
                                    src={getAuthorImage(comment.authorId, comment.authorType as 'player' | 'agent')} 
                                    alt="Commenter" 
                                    className="object-cover"
                                    fill
                                    sizes="32px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold">
                                    Y
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">
                                  {comment.authorType === 'scout' 
                                    ? 'You' 
                                    : getAuthorName(comment.authorId, comment.authorType as 'player' | 'agent')}
                                </div>
                                <div className="text-slate-400 text-xs">
                                  {formatTime(comment.timestamp)}
                                </div>
                              </div>
                            </div>
                            <p className="text-blue-100 text-sm">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Comment Section */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-1 bg-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newCommentText.trim()) {
                            addCommentToPost(activePost.id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => addCommentToPost(activePost.id)}
                        disabled={!newCommentText.trim()}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoutersCommunity;
