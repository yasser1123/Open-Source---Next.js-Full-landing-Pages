"use client"

import { motion } from "framer-motion"

// Simplified Button component with only necessary props
const Button = ({ 
  children, 
  className = "", 
}: { 
  children: React.ReactNode
  className?: string
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

// Dynamic path generator function
const generatePath = (index: number, baseOffset: number = 0) => {
  const startX = -380 - index * 5
  const startY = -189 + index * 6
  const controlX1 = -312 - index * 5
  const controlY1 = 216 - index * 6
  const controlX2 = 252 + baseOffset - index * 5
  const controlY2 = 343 - index * 6
  const endX1 = 916 + baseOffset - index * 5
  const endY1 = 470 - index * 6
  const endX2 = 984 + baseOffset - index * 5
  const endY2 = 875 - index * 6

  return `M${startX} ${startY}C${startX} ${startY} ${controlX1} ${controlY1} ${controlX2} ${controlY2}C${endX1} ${endY1} ${endX2} ${endY2} ${endX2} ${endY2}`
}

// Simplified FloatingPaths component with dynamic path generation
function FloatingPaths() {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: generatePath(i, 100), // Added baseOffset for more rightward extension
    color: i % 3 === 0 
      ? "rgba(139, 92, 246, 0.8)" 
      : i % 3 === 1 
        ? "rgba(14, 165, 233, 0.8)" 
        : "rgba(236, 72, 153, 0.8)",
    width: 0.8 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 996 316" fill="none">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {paths.map((path, index) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.3 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.7 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1,
            }}
            filter={index % 4 === 0 ? "url(#glow)" : ""}
          />
        ))}
      </svg>
    </div>
  )
}

// Simplified Particles component with direct particle generation
function Particles({ count = 12 }) {
  const particles = Array.from({ length: count }).map(() => ({
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    xMovement: [0, Math.random() * 50 - 25, 0],
    yMovement: [0, Math.random() * 50 - 25, 0],
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
          }}
          animate={{
            x: particle.xMovement,
            y: particle.yMovement,
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default function AnimatedHeroSection({
  title = "Discover Excellence",
}: {
  title?: string
}) {
  const words = title.split(" ")

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <div className="absolute inset-0 opacity-50">
        <FloatingPaths />
      </div>

      <Particles count={12} />

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      duration: 0.5,
                    }}
                    className="inline-block text-transparent bg-clip-text 
                              bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-block"
          >
            <Button
              className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-white 
                        hover:opacity-90 transition-opacity px-8 py-6 text-lg font-semibold
                        rounded-xl shadow-lg hover:shadow-xl"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
