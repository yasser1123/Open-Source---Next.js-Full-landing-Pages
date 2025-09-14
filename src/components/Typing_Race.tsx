'use client';

import React, { useState, useEffect, useRef } from 'react';

// Types
interface Asteroid {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  size: number;
}

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const WORDS = [
  'code', 'bug', 'fix', 'test', 'run', 'loop', 'web', 'app', 'git', 'push',
  'pull', 'dev', 'hack', 'link', 'host', 'data', 'type', 'file', 'game',
  'program', 'syntax', 'server', 'client', 'debug', 'system', 'deploy'
];

const Typing_Race: React.FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [userInput, setUserInput] = useState('');
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<number>(0);

  // Initialize game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setLives(3);
    setUserInput('');
    setAsteroids([]);
    
    // Focus on input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Create a new asteroid
  const createAsteroid = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const newAsteroid: Asteroid = {
      id: `asteroid-${Date.now()}-${Math.random()}`,
      word: randomWord,
      x: Math.random() * (GAME_WIDTH - 100) + 50,
      y: -80,
      speed: 1 + Math.random() * 1.5,
      size: 50 + randomWord.length * 5
    };
    
    setAsteroids(prev => [...prev, newAsteroid]);
  };

  // Game loop
  useEffect(() => {
    if (!gameActive) return;
    
    let lastAsteroidTime = 0;
    const asteroidInterval = 2000; // New asteroid every 2 seconds
    
    const gameLoop = (timestamp: number) => {
      // Create new asteroid periodically
      if (timestamp - lastAsteroidTime > asteroidInterval) {
        createAsteroid();
        lastAsteroidTime = timestamp;
      }
      
      // Move asteroids
      setAsteroids(prev => {
        const updatedAsteroids = prev.map(asteroid => ({
          ...asteroid,
          y: asteroid.y + asteroid.speed
        }));
        
        // Check for asteroids that hit the ground
        const hitGround = updatedAsteroids.filter(a => a.y > GAME_HEIGHT);
        if (hitGround.length > 0) {
          setLives(l => {
            const newLives = l - hitGround.length;
            if (newLives <= 0) {
              setGameActive(false);
            }
            return Math.max(0, newLives);
          });
        }
        
        // Keep only asteroids still on screen
        return updatedAsteroids.filter(a => a.y <= GAME_HEIGHT);
      });
      
      // Continue game loop if game is still active
      if (gameActive) {
        frameRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    frameRef.current = requestAnimationFrame(gameLoop);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [gameActive]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Check if input matches any asteroid
    const matchIndex = asteroids.findIndex(
      a => a.word.toLowerCase() === value.toLowerCase()
    );
    
    if (matchIndex !== -1) {
      // Update score
      setScore(s => s + asteroids[matchIndex].word.length * 10);
      
      // Remove matched asteroid
      setAsteroids(prev => prev.filter((_, i) => i !== matchIndex));
      
      // Clear input
      setUserInput('');
    }
  };
  
  // Prevent scrolling when typing
  useEffect(() => {
    const preventScroll = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (gameActive) {
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', preventScroll);
    return () => window.removeEventListener('keydown', preventScroll);
  }, [gameActive]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Typing Asteroid Defense
      </h1>
      
      {!gameActive ? (
        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
          <p className="mb-6 text-gray-300">
            Type the words on the falling asteroids before they hit the ground!
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Game stats */}
          <div className="flex gap-8 mb-4">
            <div className="bg-gray-800 bg-opacity-60 px-4 py-2 rounded-lg">
              <span className="font-bold text-purple-400">Score:</span> {score}
            </div>
            <div className="bg-gray-800 bg-opacity-60 px-4 py-2 rounded-lg">
              <span className="font-bold text-red-400">Lives:</span> {lives}
            </div>
          </div>
          
          {/* Game area */}
          <div
            ref={gameRef}
            className="relative bg-gray-900 bg-opacity-50 border border-purple-500/30 rounded-lg overflow-hidden"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {/* Stars background */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              />
            ))}
            
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
            
            {/* Render asteroids */}
            {asteroids.map((asteroid) => (
              <div
                key={asteroid.id}
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  left: asteroid.x,
                  top: asteroid.y,
                  width: asteroid.size,
                  height: asteroid.size,
                  background: 'radial-gradient(circle at 30% 30%, #ff7e5f, #feb47b)',
                  boxShadow: '0 0 20px rgba(255, 126, 95, 0.7)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-90"></div>
                <div className="relative z-10 font-bold text-center px-2 text-white drop-shadow-lg">
                  {asteroid.word}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input field */}
          <div className="mt-4 w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type here..."
              className="w-full bg-gray-800 bg-opacity-70 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
          
          <button
            onClick={() => setGameActive(false)}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            End Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Typing_Race;

