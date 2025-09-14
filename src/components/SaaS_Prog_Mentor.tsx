'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Code2, 
  PanelRight, 
  ArrowRight, 
  Check, 
  Star, 
  ChevronDown, 
  Menu, 
  X, 
  Send,
  Users
} from 'lucide-react';

// Define types and data
interface MentorshipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  rating: number;
  reviews: number;
  photoUrl: string;
  available: boolean;
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  photoUrl: string;
}

// Mock data
const mentorshipPlans: MentorshipPlan[] = [
  {
    id: 'plan-1',
    name: 'Starter Bundle',
    price: 99,
    duration: 'Monthly',
    features: [
      '2 hours of 1:1 mentorship',
      'Code reviews for 1 project',
      'Access to learning resources',
      'Community forum access',
      'Email support'
    ]
  },
  {
    id: 'plan-2',
    name: 'Growth Bundle',
    price: 199,
    duration: 'Monthly',
    popular: true,
    features: [
      '5 hours of 1:1 mentorship',
      'Unlimited code reviews',
      'Personalized learning path',
      'Priority community support',
      'Video call support',
      'Resume & portfolio review'
    ]
  },
  {
    id: 'plan-3',
    name: 'Professional Bundle',
    price: 349,
    duration: 'Monthly',
    features: [
      '10 hours of 1:1 mentorship',
      'Unlimited code reviews',
      'Career coaching sessions',
      'Interview preparation',
      '24/7 priority support',
      'Personalized project planning',
      'Technical skill assessment'
    ]
  }
];

const topMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Sarah Jensen',
    role: 'Senior Frontend Engineer',
    company: 'Google',
    expertise: ['React', 'TypeScript', 'CSS Architecture'],
    rating: 4.9,
    reviews: 127,
    photoUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
    available: true
  },
  {
    id: 'mentor-2',
    name: 'Michael Chen',
    role: 'Backend Architect',
    company: 'Amazon',
    expertise: ['Node.js', 'Python', 'Microservices'],
    rating: 4.8,
    reviews: 93,
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    available: true
  },
  {
    id: 'mentor-3',
    name: 'Aisha Patel',
    role: 'Full Stack Developer',
    company: 'Spotify',
    expertise: ['React', 'Node.js', 'GraphQL'],
    rating: 4.9,
    reviews: 105,
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    available: false
  },
  {
    id: 'mentor-4',
    name: 'James Wilson',
    role: 'DevOps Engineer',
    company: 'Microsoft',
    expertise: ['Docker', 'Kubernetes', 'AWS'],
    rating: 4.7,
    reviews: 87,
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    available: true
  }
];

const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    content: "The mentorship program completely transformed my coding skills. I went from struggling with basic concepts to confidently building complex applications in just a few months.",
    author: "Alex Rivera",
    role: "Junior Developer at Figma",
    photoUrl: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 'testimonial-2',
    content: "Having a senior developer review my code and guide me through best practices was invaluable. I landed my dream job after just 3 months in the program!",
    author: "Mia Johnson",
    role: "React Developer at Airbnb",
    photoUrl: "https://randomuser.me/api/portraits/women/24.jpg"
  },
  {
    id: 'testimonial-3',
    content: "The personalized learning path and career guidance helped me transition from a completely different field to tech. Best investment I've ever made in my career.",
    author: "David Kim",
    role: "Backend Engineer at Stripe",
    photoUrl: "https://randomuser.me/api/portraits/men/36.jpg"
  }
];

// Add smooth scroll function
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Main component
export default function SaaS_Prog_Mentor() {
  // State for mobile navigation and modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showMentorsModal, setShowMentorsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // Handle smooth scrolling
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    scrollToElement(sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 to-slate-950 text-gray-100 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="#" onClick={() => handleNavClick('home')} className="flex items-center gap-2">
                <Code2 className="h-8 w-8 text-teal-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                  MentorMatch
                </span>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#home" 
                className={`text-sm hover:text-teal-400 transition-colors ${
                  activeSection === 'home' ? 'text-teal-400' : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
              >
                Home
              </a>
              <a 
                href="#plans" 
                className={`text-sm hover:text-teal-400 transition-colors ${
                  activeSection === 'plans' ? 'text-teal-400' : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('plans');
                }}
              >
                Plans
              </a>
              <a 
                href="#mentors" 
                className={`text-sm hover:text-teal-400 transition-colors ${
                  activeSection === 'mentors' ? 'text-teal-400' : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('mentors');
                }}
              >
                Mentors
              </a>
              <a 
                href="#testimonials" 
                className={`text-sm hover:text-teal-400 transition-colors ${
                  activeSection === 'testimonials' ? 'text-teal-400' : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('testimonials');
                }}
              >
                Testimonials
              </a>
              <a 
                href="#faq" 
                className={`text-sm hover:text-teal-400 transition-colors ${
                  activeSection === 'faq' ? 'text-teal-400' : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('faq');
                }}
              >
                FAQ
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a 
                href="#home"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === 'home' 
                    ? 'text-teal-400 bg-slate-800' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
              >
                Home
              </a>
              <a 
                href="#plans"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === 'plans' 
                    ? 'text-teal-400 bg-slate-800' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('plans');
                }}
              >
                Plans
              </a>
              <a 
                href="#mentors"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === 'mentors' 
                    ? 'text-teal-400 bg-slate-800' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('mentors');
                }}
              >
                Mentors
              </a>
              <a 
                href="#testimonials"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === 'testimonials' 
                    ? 'text-teal-400 bg-slate-800' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('testimonials');
                }}
              >
                Testimonials
              </a>
              <a 
                href="#faq"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === 'faq' 
                    ? 'text-teal-400 bg-slate-800' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('faq');
                }}
              >
                FAQ
              </a>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
      <section 
        id="home" 
        className="relative py-20 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(56,189,248,0.1),transparent_70%),radial-gradient(circle_at_60%_50%,rgba(129,140,248,0.08),transparent_70%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Level Up Your Coding Skills with Expert Mentorship
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-300 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Connect with experienced developers who&apos;ll guide you through your programming journey.
              Get personalized learning paths, code reviews, and career advice.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <a 
                href="#plans" 
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/20 font-medium flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('plans');
                }}
              >
                Browse Plans <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="#mentors" 
                className="px-8 py-3 rounded-lg bg-slate-800/80 border border-white/10 hover:bg-slate-700/80 font-medium flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('mentors');
                }}
              >
                Meet Our Mentors
              </a>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Code Reviews</h3>
              <p className="text-gray-400 text-sm">Get detailed feedback on your code from senior developers to learn best practices and improve your skills.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">1:1 Mentorship</h3>
              <p className="text-gray-400 text-sm">Schedule personalized sessions with experts in your field to get guidance tailored to your specific needs.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                <PanelRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Career Guidance</h3>
              <p className="text-gray-400 text-sm">Get advice on job hunting, interview preparation, and career progression from those who&apos;ve been there.</p>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </section>

      {/* Plans Section */}
      <section 
        id="plans" 
        className="relative py-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400 mb-4">
              Choose Your Mentorship Plan
            </h2>
            <p className="text-gray-300">
              Select the package that fits your learning goals and budget. All plans include access to our community forum.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {mentorshipPlans.map((plan) => (
              <motion.div 
                key={plan.id}
                className={`relative h-full overflow-hidden rounded-2xl border ${
                  plan.popular 
                    ? 'border-teal-500/50 bg-gradient-to-b from-teal-950/50 to-slate-900' 
                    : 'border-white/10 bg-slate-900/50'
                } p-6 backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-teal-500 text-xs font-medium px-3 py-1 rounded-bl-lg text-slate-950">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-400 ml-1">/{plan.duration.toLowerCase()}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-gray-100 border border-white/10'
                  }`}
                  onClick={() => handleNavClick('mentors')}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">Need something more specific?</p>
            <button 
              className="px-6 py-2 rounded-lg bg-slate-800/80 border border-white/10 hover:bg-slate-700/80 text-sm font-medium"
              onClick={() => handleNavClick('mentors')}
            >
              Contact Us for Custom Plans
            </button>
          </div>
        </div>
      </section>
      
      {/* Mentors Section */}
      <section 
        id="mentors" 
        className="relative py-20 overflow-hidden bg-slate-950/80"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(56,178,172,0.1),transparent_70%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400 mb-4">
              Meet Our Expert Mentors
            </h2>
            <p className="text-gray-300">
              Learn from industry professionals with years of experience at top tech companies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMentors.map((mentor) => (
              <motion.div 
                key={mentor.id}
                className="bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <img 
                    src={mentor.photoUrl} 
                    alt={mentor.name} 
                    className="w-full h-48 object-cover"
                  />
                  {mentor.available ? (
                    <div className="absolute bottom-2 right-2 bg-emerald-500 px-2 py-1 rounded text-xs font-medium text-emerald-950">
                      Available
                    </div>
                  ) : (
                    <div className="absolute bottom-2 right-2 bg-slate-700 px-2 py-1 rounded text-xs font-medium text-slate-200">
                      Fully Booked
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">{mentor.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 mr-1" />
                      <span className="text-sm">{mentor.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-1">{mentor.role}</p>
                  <p className="text-gray-500 text-xs mb-3">at {mentor.company}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-slate-800 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    className={`w-full py-2 rounded-lg text-sm transition-colors ${
                      mentor.available
                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                        : 'bg-slate-800 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!mentor.available}
                    onClick={() => {
                      if (mentor.available) {
                        setSelectedMentor(mentor);
                        setShowScheduleModal(true);
                      }
                    }}
                  >
                    {mentor.available ? 'Schedule Session' : 'Join Waitlist'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button 
              className="px-6 py-2.5 rounded-lg bg-slate-800/80 border border-white/10 hover:bg-slate-700/80 text-sm font-medium flex items-center gap-2 mx-auto"
              onClick={() => setShowMentorsModal(true)}
            >
              <Users className="h-4 w-4" />
              Browse All Mentors
            </button>
          </div>
        </div>
      </section>

      {/* Schedule Session Modal */}
      {showScheduleModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex justify-between items-center border-b border-white/10 p-4">
              <h3 className="text-xl font-medium">Schedule a Session</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedMentor(null);
                }}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedMentor.photoUrl}
                  alt={selectedMentor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-lg">{selectedMentor.name}</h4>
                  <p className="text-gray-400 text-sm">{selectedMentor.role} at {selectedMentor.company}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="session-date" className="block text-sm text-gray-400 mb-1">Select Date</label>
                  <input
                    id="session-date"
                    type="date"
                    className="w-full p-2 bg-slate-800 border border-white/10 rounded-lg text-white"
                    placeholder="Choose a date"
                  />
                </div>
                
                <div>
                  <label htmlFor="session-time" className="block text-sm text-gray-400 mb-1">Select Time Slot</label>
                  <select 
                    id="session-time"
                    className="w-full p-2 bg-slate-800 border border-white/10 rounded-lg text-white"
                    aria-label="Select time slot for session"
                  >
                    <option value="">Select a time slot</option>
                    <option value="09:00">09:00 AM - 10:00 AM</option>
                    <option value="10:00">10:00 AM - 11:00 AM</option>
                    <option value="11:00">11:00 AM - 12:00 PM</option>
                    <option value="13:00">01:00 PM - 02:00 PM</option>
                    <option value="14:00">02:00 PM - 03:00 PM</option>
                    <option value="15:00">03:00 PM - 04:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="session-topic" className="block text-sm text-gray-400 mb-1">What would you like to discuss?</label>
                  <textarea
                    id="session-topic"
                    className="w-full p-2 bg-slate-800 border border-white/10 rounded-lg text-white h-24 resize-none"
                    placeholder="Describe what you'd like to focus on in this session..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedMentor(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setShowSuccessMessage(true);
                    setTimeout(() => {
                      setShowSuccessMessage(false);
                    }, 5000); // Hide after 5 seconds
                  }}
                >
                  Book Session
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* All Mentors Modal */}
      {showMentorsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-6xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex justify-between items-center border-b border-white/10 p-4">
              <h3 className="text-xl font-medium">All Available Mentors</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowMentorsModal(false)}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Expanded list of mentors - include original mentors plus additional ones */}
                {[...topMentors, 
                  {
                    id: 'mentor-5',
                    name: 'Emily Rodriguez',
                    role: 'Mobile Developer',
                    company: 'Uber',
                    expertise: ['React Native', 'Swift', 'Kotlin'],
                    rating: 4.8,
                    reviews: 76,
                    photoUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
                    available: true
                  },
                  {
                    id: 'mentor-6',
                    name: 'Thomas Wilson',
                    role: 'Data Scientist',
                    company: 'Netflix',
                    expertise: ['Python', 'TensorFlow', 'Data Visualization'],
                    rating: 4.9,
                    reviews: 92,
                    photoUrl: 'https://randomuser.me/api/portraits/men/54.jpg',
                    available: true
                  },
                  {
                    id: 'mentor-7',
                    name: 'Sophia Lee',
                    role: 'Product Manager',
                    company: 'Slack',
                    expertise: ['Agile', 'User Research', 'Product Strategy'],
                    rating: 4.7,
                    reviews: 65,
                    photoUrl: 'https://randomuser.me/api/portraits/women/50.jpg',
                    available: false
                  },
                  {
                    id: 'mentor-8',
                    name: 'Robert Johnson',
                    role: 'Security Engineer',
                    company: 'Cloudflare',
                    expertise: ['Cybersecurity', 'Penetration Testing', 'Security Architecture'],
                    rating: 4.9,
                    reviews: 81,
                    photoUrl: 'https://randomuser.me/api/portraits/men/41.jpg',
                    available: true
                  },
                  {
                    id: 'mentor-9',
                    name: 'Olivia Martinez',
                    role: 'UI/UX Designer',
                    company: 'Figma',
                    expertise: ['UI Design', 'User Testing', 'Design Systems'],
                    rating: 4.8,
                    reviews: 89,
                    photoUrl: 'https://randomuser.me/api/portraits/women/39.jpg',
                    available: true
                  }
                ].map((mentor) => (
                  <div 
                    key={mentor.id}
                    className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                  >
                    <div className="relative">
                      <img 
                        src={mentor.photoUrl} 
                        alt={mentor.name} 
                        className="w-full h-36 object-cover"
                      />
                      {mentor.available ? (
                        <div className="absolute bottom-2 right-2 bg-emerald-500 px-2 py-1 rounded text-xs font-medium text-emerald-950">
                          Available
                        </div>
                      ) : (
                        <div className="absolute bottom-2 right-2 bg-slate-700 px-2 py-1 rounded text-xs font-medium text-slate-200">
                          Fully Booked
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{mentor.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-amber-400 mr-1" />
                          <span className="text-xs">{mentor.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-xs mb-1">{mentor.role}</p>
                      <p className="text-gray-500 text-xs mb-2">at {mentor.company}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mentor.expertise.map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-slate-700 text-gray-300 text-xs px-1.5 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        className={`w-full py-1.5 text-xs rounded-lg transition-colors ${
                          mentor.available
                            ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                            : 'bg-slate-700 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!mentor.available}
                        onClick={() => {
                          if (mentor.available) {
                            setSelectedMentor(mentor);
                            setShowMentorsModal(false);
                            setShowScheduleModal(true);
                          }
                        }}
                      >
                        {mentor.available ? 'Schedule Session' : 'Join Waitlist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/10 p-4 flex justify-end">
              <button 
                className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700"
                onClick={() => setShowMentorsModal(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        className="relative py-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400 mb-4">
              Success Stories
            </h2>
            <p className="text-gray-300">
              Hear from our students who transformed their careers with the help of our mentors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.photoUrl} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.author}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section 
        id="faq" 
        className="relative py-20 overflow-hidden bg-slate-950/80"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300">
              Got questions? We&apos;ve got answers.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <button 
                className={`w-full px-6 py-4 flex justify-between items-center ${activeFaq === 'faq-1' ? 'bg-slate-800' : 'bg-slate-900/60'}`}
                onClick={() => setActiveFaq(activeFaq === 'faq-1' ? null : 'faq-1')}
              >
                <span className="font-medium text-left">How do the mentorship sessions work?</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === 'faq-1' ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === 'faq-1' && (
                <div className="px-6 py-4 bg-slate-800/50 border-t border-white/10">
                  <p className="text-gray-300 text-sm">
                    Our mentorship sessions are conducted over video calls at times that work for both you and your mentor. 
                    You&apos;ll have access to a shared coding environment, screen sharing, and other collaborative tools. 
                    Before the session, you can send specific topics or code you&apos;d like to review to make the most of your time.
                  </p>
                </div>
              )}
            </div>
            
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <button 
                className={`w-full px-6 py-4 flex justify-between items-center ${activeFaq === 'faq-2' ? 'bg-slate-800' : 'bg-slate-900/60'}`}
                onClick={() => setActiveFaq(activeFaq === 'faq-2' ? null : 'faq-2')}
              >
                <span className="font-medium text-left">Can I change my mentor if we&apos;re not a good fit?</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === 'faq-2' ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === 'faq-2' && (
                <div className="px-6 py-4 bg-slate-800/50 border-t border-white/10">
                  <p className="text-gray-300 text-sm">
                    Absolutely! We understand that having the right mentor is crucial for your learning journey. 
                    If you don&apos;t feel your current mentor is the right fit, you can request a change through your dashboard. 
                    We&apos;ll help you find a mentor who better matches your learning style and goals.
                  </p>
                </div>
              )}
            </div>
            
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <button 
                className={`w-full px-6 py-4 flex justify-between items-center ${activeFaq === 'faq-3' ? 'bg-slate-800' : 'bg-slate-900/60'}`}
                onClick={() => setActiveFaq(activeFaq === 'faq-3' ? null : 'faq-3')}
              >
                <span className="font-medium text-left">What happens if I miss a scheduled session?</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === 'faq-3' ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === 'faq-3' && (
                <div className="px-6 py-4 bg-slate-800/50 border-t border-white/10">
                  <p className="text-gray-300 text-sm">
                    We understand that life happens! If you need to miss a session, please give at least 24 hours notice so your mentor can adjust their schedule. 
                    You can reschedule directly through the platform. Sessions canceled with less than 24 hours notice may still count against your monthly allotment, 
                    but we do offer a one-time forgiveness policy for emergencies.
                  </p>
                </div>
              )}
            </div>
            
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <button 
                className={`w-full px-6 py-4 flex justify-between items-center ${activeFaq === 'faq-4' ? 'bg-slate-800' : 'bg-slate-900/60'}`}
                onClick={() => setActiveFaq(activeFaq === 'faq-4' ? null : 'faq-4')}
              >
                <span className="font-medium text-left">Can I upgrade or downgrade my plan?</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === 'faq-4' ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === 'faq-4' && (
                <div className="px-6 py-4 bg-slate-800/50 border-t border-white/10">
                  <p className="text-gray-300 text-sm">
                    Yes, you can change your plan at any time. If you upgrade mid-billing cycle, we&apos;ll prorate the difference. 
                    If you downgrade, the change will take effect at the start of your next billing cycle. 
                    You can manage your subscription directly from your account settings.
                  </p>
                </div>
              )}
            </div>
            
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <button 
                className={`w-full px-6 py-4 flex justify-between items-center ${activeFaq === 'faq-5' ? 'bg-slate-800' : 'bg-slate-900/60'}`}
                onClick={() => setActiveFaq(activeFaq === 'faq-5' ? null : 'faq-5')}
              >
                <span className="font-medium text-left">Do you offer refunds?</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === 'faq-5' ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === 'faq-5' && (
                <div className="px-6 py-4 bg-slate-800/50 border-t border-white/10">
                  <p className="text-gray-300 text-sm">
                    We offer a 7-day satisfaction guarantee for new members. If you&apos;re not happy with the service within the first week, 
                    we&apos;ll provide a full refund. After that period, we don&apos;t offer refunds for unused time, but you can cancel your subscription 
                    at any time to prevent future billing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-indigo-900/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Coding Journey?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are learning faster and building better with personalized mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/20 font-medium"
              onClick={() => handleNavClick('plans')}
            >
              Start Your Free Trial
            </button>
            <button 
              className="px-8 py-3 rounded-lg bg-slate-800/80 border border-white/10 hover:bg-slate-700/80 font-medium"
              onClick={() => {
                setSelectedMentor(topMentors[0]);
                setShowScheduleModal(true);
              }}
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-6 w-6 text-teal-400" />
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                  MentorMatch
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Empowering developers through personalized mentorship and expert guidance.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Community Forum</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Learning Paths</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Careers</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Become a Mentor</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Contact</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for tips, new mentors, and community updates.
              </p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button 
                  type="submit"
                  className="p-2 bg-teal-600 hover:bg-teal-700 rounded-lg"
                  aria-label="Submit newsletter signup"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} MentorMatch. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-emerald-900/90 border border-emerald-500/30 text-emerald-100 p-4 rounded-lg shadow-xl backdrop-blur-sm flex items-start gap-3"
          >
            <div className="bg-emerald-500/20 p-1 rounded-full">
              <Check className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-medium text-emerald-300 mb-1">Session Booked Successfully!</h3>
              <p className="text-sm">
                {selectedMentor ? `Your session with ${selectedMentor.name} has been scheduled. We've sent a confirmation to your email.` : "Your mentorship session has been scheduled. We've sent a confirmation to your email."}
              </p>
              <div className="mt-3 flex justify-end">
                <button 
                  className="text-xs text-emerald-300 hover:text-emerald-100"
                  onClick={() => setShowSuccessMessage(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
