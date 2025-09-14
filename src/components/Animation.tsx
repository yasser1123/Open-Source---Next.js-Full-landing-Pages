"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion"
import { MdArrowForward, MdArrowBack, MdClose } from "react-icons/md"
import { FaLeaf, FaRuler, FaPaintBrush, FaRecycle } from "react-icons/fa"

interface StoryboardSlide {
  id: number
  title: string
  description: string
  image: string
  color: string
  icon: React.ReactNode
  sketch: string
}

const storyboardData: StoryboardSlide[] = [
  {
    id: 1,
    title: "ELEGANT ORIGINS",
    description: "Crafted from sustainable materials, our journey begins with respect for nature and artisanal excellence.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1035&auto=format&fit=crop",
    color: "from-amber-200 to-amber-600",
    icon: <FaLeaf className="text-amber-600" />,
    sketch: `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M100,50 C120,30 180,30 200,50 C220,70 280,70 300,50 C320,30 300,100 280,120 C260,140 220,160 200,140 C180,120 140,140 120,120 C100,100 80,70 100,50 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M150,80 C170,60 230,60 250,80" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M140,100 Q200,130 260,100" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M200,50 L200,140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
        <circle cx="200" cy="95" r="5" fill="currentColor" />
      </svg>
    `
  },
  {
    id: 2,
    title: "TIMELESS DESIGN",
    description: "Each piece balances contemporary aesthetics with classic sensibilities, designed to transcend seasonal trends.",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=774&auto=format&fit=crop",
    color: "from-rose-200 to-rose-600",
    icon: <FaRuler className="text-rose-600" />,
    sketch: `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="100" y="50" width="200" height="100" rx="20" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="80" y1="50" x2="320" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="80" y1="150" x2="320" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
        <path d="M150,50 C150,30 250,30 250,50" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="150" cy="100" r="5" fill="currentColor" />
        <circle cx="250" cy="100" r="5" fill="currentColor" />
      </svg>
    `
  },
  {
    id: 3,
    title: "ARTISAN CRAFT",
    description: "Our skilled artisans meticulously handcraft each bag, embedding generations of expertise into every stitch.",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1171&auto=format&fit=crop",
    color: "from-blue-200 to-blue-600",
    icon: <FaPaintBrush className="text-blue-600" />,
    sketch: `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M100,100 C150,70 250,70 300,100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M100,120 C150,90 250,90 300,120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M150,50 L170,150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M250,50 L230,150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M120,60 C120,60 150,40 200,60 C250,80 280,60 280,60" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="100" r="3" fill="currentColor" />
      </svg>
    `
  },
  {
    id: 4,
    title: "SUSTAINABLE LUXURY",
    description: "Redefining luxury through ethical practices and eco-friendly materials without compromising on quality.",
    image: "https://images.unsplash.com/photo-1575891643064-dd6c561cfef9?q=80&w=1032&auto=format&fit=crop",
    color: "from-emerald-200 to-emerald-600",
    icon: <FaRecycle className="text-emerald-600" />,
    sketch: `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="200" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
        <path d="M170,70 L230,130" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M230,70 L170,130" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M200,50 L200,150" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M150,100 L250,100" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    `
  },
]

const TextReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.03,
            delayChildren: delay,
          },
        },
      }}
      className="inline-block"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// New component for improved background animations
const EnhancedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(74, 4, 78, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(74, 4, 78, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(74, 4, 78, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(74, 4, 78, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(74, 4, 78, 0.5) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ 
              width: "100%", 
              top: `${20 + i * 15}%`,
              left: 0,
              scaleX: 0.8,
              originX: 0.5
            }}
            animate={{
              scaleX: [0.8, 1, 0.8],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Floating particles */}
      <FloatingObjects />
      
      {/* Animated circles */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full border border-white/10"
            style={{ 
              width: `${300 + i * 200}px`, 
              height: `${300 + i * 200}px`,
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%'
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
              borderColor: [
                'rgba(255,255,255,0.03)',
                'rgba(255,255,255,0.08)',
                'rgba(255,255,255,0.03)'
              ]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/30 to-gray-900/80"></div>
    </div>
  )
}

// Improved FloatingObjects with more variety
const FloatingObjects = () => {
  // Generate 20 random objects with different properties
  const floatingItems = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    type: Math.floor(Math.random() * 8), // 0-7 different shapes
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute opacity-20"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, Math.random() * 360, 0],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.type === 0 && (
            <div 
              className="rounded-full border border-white/30" 
              style={{ width: `${item.size * 10}px`, height: `${item.size * 10}px` }} 
            />
          )}
          {item.type === 1 && (
            <div 
              className="border border-white/20 rotate-45" 
              style={{ width: `${item.size * 8}px`, height: `${item.size * 8}px` }} 
            />
          )}
          {item.type === 2 && (
            <div className="opacity-30">
              <svg width={item.size * 15} height={item.size * 5} viewBox="0 0 60 20">
                <path 
                  d="M0,10 Q15,20 30,10 T60,10" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="0.5" 
                />
              </svg>
            </div>
          )}
          {item.type === 3 && (
            <div className="opacity-30">
              <svg width={item.size * 15} height={item.size * 15} viewBox="0 0 40 40">
                <polygon 
                  points="20,0 40,20 20,40 0,20" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="0.5" 
                />
              </svg>
            </div>
          )}
          {item.type === 4 && (
            <div className="opacity-30">
              <svg width={item.size * 12} height={item.size * 12} viewBox="0 0 30 30">
                <circle 
                  cx="15" 
                  cy="15" 
                  r="10" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="0.5" 
                  strokeDasharray="2,2" 
                />
              </svg>
            </div>
          )}
          {item.type === 5 && (
            <div className="opacity-30">
              <svg width={item.size * 15} height={item.size * 15} viewBox="0 0 40 40">
                <path 
                  d="M10,0 L30,0 L40,10 L40,30 L30,40 L10,40 L0,30 L0,10 Z" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="0.5" 
                />
              </svg>
            </div>
          )}
          {item.type === 6 && (
            <div className="opacity-30">
              <svg width={item.size * 10} height={item.size * 10} viewBox="0 0 30 30">
                <line x1="0" y1="15" x2="30" y2="15" stroke="white" strokeWidth="0.5" />
                <line x1="15" y1="0" x2="15" y2="30" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
          )}
          {item.type === 7 && (
            <div className="opacity-30">
              <svg width={item.size * 12} height={item.size * 12} viewBox="0 0 30 30">
                <path 
                  d="M15,0 Q30,15 15,30 Q0,15 15,0" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="0.5" 
                />
              </svg>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

const Sketch = ({ sketch, color }: { sketch: string; color: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className={`p-4 bg-white/90 rounded-lg shadow-md border border-${color.split('-')[2]}-100 h-full w-full text-${color.split('-')[2]}-700`}
      dangerouslySetInnerHTML={{ __html: sketch }}
    />
  )
}

// Add new component for floating sketches
const FloatingSketch = ({ sketch, color, position, delay = 0 }: { 
  sketch: string; 
  color: string; 
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
}) => {
  const positionClasses = {
    "top-left": "top-8 -left-32 md:-left-48 rotate-[-8deg]",
    "top-right": "top-8 -right-32 md:-right-48 rotate-[8deg]",
    "bottom-left": "bottom-8 -left-32 md:-left-48 rotate-[8deg]",
    "bottom-right": "bottom-8 -right-32 md:-right-48 rotate-[-8deg]",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.9, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`absolute w-40 md:w-56 h-32 md:h-44 ${positionClasses[position]} shadow-xl z-30 cursor-pointer hidden md:block`}
      whileHover={{ scale: 1.05, rotate: 0, y: -5 }}
      drag
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 rounded-lg -z-10`}></div>
      <div className="absolute inset-0 p-2">
        <div
          className={`h-full w-full text-white`}
          dangerouslySetInnerHTML={{ __html: sketch }}
        />
      </div>
    </motion.div>
  )
}

// Replace the AnimatedBackground component with the enhanced version
const AnimatedBackground = EnhancedBackground

export default function HansbagStoryboard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullscreenSketch, setShowFullscreenSketch] = useState(false)
  const currentSlide = storyboardData[currentIndex]
  const colorName = currentSlide.color.split("-")[2]
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === storyboardData.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? storyboardData.length - 1 : prev - 1))
  }

  // Auto advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showFullscreenSketch) {
        nextSlide()
      }
    }, 8000)
    return () => clearTimeout(timer)
  }, [currentIndex, showFullscreenSketch])

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 relative">
      <AnimatedBackground />
      
      {/* Centered header at the top */}
      <motion.div 
        className="absolute top-6 md:top-8 left-1/2 transform -translate-x-1/2 z-20 w-full pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
       
      </motion.div>
      
      {/* Floating sketches outside the container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`outside-sketches-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <div className="relative w-full h-full">
            <FloatingSketch 
              sketch={storyboardData[0].sketch} 
              color={storyboardData[0].color} 
              position="top-left" 
              delay={0.2}
            />
            <FloatingSketch 
              sketch={storyboardData[1].sketch} 
              color={storyboardData[1].color} 
              position="top-right" 
              delay={0.4}
            />
            <FloatingSketch 
              sketch={storyboardData[2].sketch} 
              color={storyboardData[2].color} 
              position="bottom-left" 
              delay={0.6}
            />
            <FloatingSketch 
              sketch={storyboardData[3].sketch} 
              color={storyboardData[3].color} 
              position="bottom-right" 
              delay={0.8}
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="w-full max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden relative z-20 mt-12 md:mt-16">
        <motion.div
          animate={{ 
            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` 
          }}
          className={`absolute inset-0 bg-gradient-to-br ${currentSlide.color} opacity-20`}
          transition={{ duration: 0.7 }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative h-80 md:h-auto overflow-hidden"
            >
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-30"></div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="relative p-8 md:p-12 flex flex-col justify-center bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`h-0.5 w-10 bg-gradient-to-r ${currentSlide.color}`}></div>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <span>{`${currentIndex + 1} / ${storyboardData.length}`}</span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        {currentSlide.icon}
                      </motion.span>
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    <TextReveal text={currentSlide.title} delay={0.2} />
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  <TextReveal text={currentSlide.description} delay={0.4} />
                </p>
                
                {/* Design process snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className={`p-3 rounded-lg bg-${colorName}-50 border border-${colorName}-100 text-sm`}
                >
                  <p className={`text-${colorName}-700 font-medium`}>Design Process:</p>
                  <p className={`text-${colorName}-600 mt-1`}>
                    {currentIndex === 0 && "Sourcing premium sustainable materials from ethical suppliers."}
                    {currentIndex === 1 && "Creating clean lines that balance modern sensibilities with classic elegance."}
                    {currentIndex === 2 && "Each stitch is placed with purpose, following techniques passed down generations."}
                    {currentIndex === 3 && "Implementing zero-waste design principles without compromising luxury."}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-white bg-gradient-to-r ${currentSlide.color} cursor-pointer shadow-md hover:shadow-lg transition-shadow`}>
                    <span>Explore Collection</span>
                    <MdArrowForward className="ml-2" />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex space-x-3">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Previous slide"
              >
                <MdArrowBack className="text-gray-700" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Next slide"
              >
                <MdArrowForward className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {storyboardData.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex 
                  ? `bg-gradient-to-r ${currentSlide.color}` 
                  : "bg-gray-300"
              }`}
              animate={{
                scale: index === currentIndex ? 1.5 : 1,
              }}
              transition={{ duration: 0.3 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen sketch modal */}
      <AnimatePresence>
        {showFullscreenSketch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-xl p-8"
            >
              <button 
                onClick={() => setShowFullscreenSketch(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="Close sketch"
              >
                <MdClose />
              </button>
              
              <h3 className={`text-xl font-bold mb-4 text-${colorName}-700`}>Design Sketch: {currentSlide.title}</h3>
              
              <div className="w-full h-[50vh]">
                <Sketch sketch={currentSlide.sketch} color={currentSlide.color} />
              </div>
              
              <div className={`mt-6 p-4 bg-${colorName}-50 rounded-lg text-${colorName}-700`}>
                <p className="font-medium">Design Notes:</p>
                <p className="mt-2 text-sm">
                  {currentIndex === 0 && "The fluid, organic shape represents our commitment to natural materials. Each curve symbolizes how we adapt nature's beauty into functional elegance."}
                  {currentIndex === 1 && "The golden ratio guides our proportions. Notice how the rectangular form maintains balance while allowing for distinctive character in each piece."}
                  {currentIndex === 2 && "The parallel stitch lines demonstrate our commitment to precision. Each thread is placed with intention, creating a harmony of form and function."}
                  {currentIndex === 3 && "The circular design represents our commitment to sustainability. We ensure each material can be recycled or biodegraded at the end of its lifecycle."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
