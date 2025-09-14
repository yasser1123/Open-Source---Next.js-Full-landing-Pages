'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextTypingGameProps {
  words?: string[];
  timeLimit?: number; // in seconds
}

const TextTypingGame: React.FC<TextTypingGameProps> = ({ 
  words = ['JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'NEXTJS', 'TAILWIND', 'PROGRAMMING', 'DEVELOPER', 'FRONTEND', 'BACKEND', 'FULLSTACK'],
  timeLimit = 60
}) => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [score, setScore] = useState<number>(0);
  const [showScaryEffect, setShowScaryEffect] = useState<boolean>(false);
  const [lastGuess, setLastGuess] = useState<{ letter: string; correct: boolean } | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerName, setPlayerName] = useState<string>('');
  const [highScores, setHighScores] = useState<Array<{name: string, score: number, difficulty: string}>>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialize game
  useEffect(() => {
    // Load high scores from localStorage
    const savedScores = localStorage.getItem('typingGameHighScores');
    if (savedScores) {
      try {
        setHighScores(JSON.parse(savedScores));
      } catch (e) {
        console.error('Failed to parse high scores:', e);
      }
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameStatus('lost');
            setShowGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, timeLeft]);

  // Reset animation states when game status changes
  useEffect(() => {
    if (gameStatus === 'playing') {
      setShowConfetti(false);
      setShowGameOver(false);
    }
  }, [gameStatus]);

  const startNewGame = () => {
    if (gameStatus === 'intro' && !playerName.trim()) {
      alert('Please enter your name to start the game');
      return;
    }
    
    // Filter words based on difficulty
    let filteredWords = [...words];
    if (difficulty === 'easy') {
      filteredWords = words.filter(word => word.length <= 6);
    } else if (difficulty === 'hard') {
      filteredWords = words.filter(word => word.length >= 8);
    }
    
    // Ensure we have words for the selected difficulty
    if (filteredWords.length === 0) {
      filteredWords = words;
    }
    
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setMistakes(0);
    setGameStatus('playing');
    setTimeLeft(timeLimit);
    setScore(0);
    setShowScaryEffect(false);
    setLastGuess(null);
    setShowConfetti(false);
    setShowGameOver(false);
    
    // Focus input after a short delay
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleGuess = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus !== 'playing') return;
    
    const guess = e.target.value.toUpperCase();
    if (!guess || guessedLetters.has(guess)) {
      e.target.value = '';
      return;
    }

    setLastGuess({ letter: guess, correct: currentWord.includes(guess) });
    
    if (currentWord.includes(guess)) {
      setGuessedLetters(prev => new Set([...Array.from(prev), guess]));
      
      // Check if word is complete
      const newGuessedLetters = new Set([...Array.from(guessedLetters), guess]);
      const isWordComplete = currentWord.split('').every(letter => newGuessedLetters.has(letter));
      
      if (isWordComplete) {
        setGameStatus('won');
        setShowConfetti(true);
        const newScore = score + 100 + (timeLeft * 2);
        setScore(newScore);
        
        // Update high scores
        const newHighScores = [...highScores, { name: playerName, score: newScore, difficulty }]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        
        setHighScores(newHighScores);
        localStorage.setItem('typingGameHighScores', JSON.stringify(newHighScores));
      }
    } else {
      setMistakes(prev => prev + 1);
      setShowScaryEffect(true);
      
      // Reset scary effect after animation
      setTimeout(() => {
        setShowScaryEffect(false);
      }, 1000);
      
      // Check if too many mistakes
      if (mistakes + 1 >= 6) {
        setGameStatus('lost');
        setShowGameOver(true);
      }
    }
    
    e.target.value = '';
  };

  // Handle keyboard button click
  const handleKeyboardClick = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;
    
    setLastGuess({ letter, correct: currentWord.includes(letter) });
    
    if (currentWord.includes(letter)) {
      setGuessedLetters(prev => new Set([...Array.from(prev), letter]));
      
      // Check if word is complete
      const newGuessedLetters = new Set([...Array.from(guessedLetters), letter]);
      const isWordComplete = currentWord.split('').every(letter => newGuessedLetters.has(letter));
      
      if (isWordComplete) {
        setGameStatus('won');
        setShowConfetti(true);
        const newScore = score + 100 + (timeLeft * 2);
        setScore(newScore);
        
        // Update high scores
        const newHighScores = [...highScores, { name: playerName, score: newScore, difficulty }]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        
        setHighScores(newHighScores);
        localStorage.setItem('typingGameHighScores', JSON.stringify(newHighScores));
      }
    } else {
      setMistakes(prev => prev + 1);
      setShowScaryEffect(true);
      
      // Reset scary effect after animation
      setTimeout(() => {
        setShowScaryEffect(false);
      }, 1000);
      
      // Check if too many mistakes
      if (mistakes + 1 >= 6) {
        setGameStatus('lost');
        setShowGameOver(true);
      }
    }
  };

  const renderWord = () => {
    return currentWord.split('').map((letter, index) => (
      <motion.span
        key={index}
        className="inline-block w-8 h-8 sm:w-10 sm:h-10 mx-0.5 sm:mx-1 text-center text-xl sm:text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: guessedLetters.has(letter) ? 1 : 0.3,
          y: 0,
          color: guessedLetters.has(letter) ? '#10B981' : '#6B7280',
          scale: guessedLetters.has(letter) && gameStatus === 'won' ? [1, 1.2, 1] : 1
        }}
        transition={{ 
          duration: 0.3,
          scale: { duration: 0.5, times: [0, 0.5, 1] }
        }}
      >
        {guessedLetters.has(letter) ? letter : '_'}
      </motion.span>
    ));
  };

  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
      <div className="grid grid-cols-5 sm:grid-cols-7 gap-1 sm:gap-2 mt-4 sm:mt-8">
        {alphabet.map(letter => (
          <motion.button
            key={letter}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md font-medium text-sm sm:text-base ${
              guessedLetters.has(letter)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
            }`}
            disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
            onClick={() => handleKeyboardClick(letter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {letter}
          </motion.button>
        ))}
      </div>
    );
  };

  const renderIntroScreen = () => {
    return (
      <motion.div 
        className="w-full max-w-md sm:max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-8 shadow-2xl border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          Word Guessing Game
        </h1>
        <p className="text-center text-gray-300 mb-4 sm:mb-8 text-sm sm:text-base">
          Test your typing skills and guess the programming-related words!
        </p>
        
        <div className="mb-4 sm:mb-6">
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          <div className="flex space-x-2 sm:space-x-4">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-md font-medium text-sm sm:text-base ${
                  difficulty === level
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={startNewGame}
          className="w-full py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-md font-medium transition-colors text-white text-base sm:text-lg"
        >
          Start Game
        </button>
        
        {highScores.length > 0 && (
          <div className="mt-4 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-center text-gray-300">High Scores</h2>
            <div className="bg-gray-800 rounded-md p-2 sm:p-4">
              {highScores.map((score, index) => (
                <div key={index} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-700 last:border-0">
                  <div className="flex items-center">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="text-white text-sm sm:text-base">{score.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 text-xs sm:text-sm mr-2">{score.difficulty}</span>
                    <span className="text-indigo-400 font-bold text-sm sm:text-base">{score.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderGameScreen = () => {
    return (
      <div className="w-full max-w-md sm:max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 space-y-2 sm:space-y-0">
          <div className="text-base sm:text-xl font-bold">
            Score: <span className="text-indigo-400">{score}</span>
          </div>
          <div className="text-base sm:text-xl font-bold">
            Time: <span className={timeLeft < 10 ? "text-red-500" : "text-white"}>{timeLeft}s</span>
          </div>
          <div className="text-base sm:text-xl font-bold">
            Mistakes: <span className="text-red-500">{mistakes}/6</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-8 shadow-2xl border border-gray-700 relative overflow-hidden">
          {/* Confetti animation for winning */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][Math.floor(Math.random() * 6)]
                  }}
                  initial={{ 
                    y: -20, 
                    x: 0, 
                    opacity: 1,
                    scale: 0
                  }}
                  animate={{ 
                    y: '100vh', 
                    x: Math.random() * 200 - 100, 
                    opacity: 0,
                    scale: 1,
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}

          {/* Game over animation for losing */}
          {showGameOver && (
            <motion.div 
              className="absolute inset-0 bg-red-900/30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 10,
                  delay: 0.5
                }}
              >
                <div className="text-3xl sm:text-6xl md:text-8xl font-bold text-red-500 opacity-50 text-center px-4">GAME OVER</div>
              </motion.div>
            </motion.div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Word Guessing Game
          </h1>
          <p className="text-center text-gray-400 mb-4 sm:mb-8 text-sm sm:text-base">
            Player: <span className="text-indigo-400">{playerName}</span> | Difficulty: <span className="text-indigo-400">{difficulty}</span>
          </p>
          
          <div className="flex flex-wrap justify-center mb-4 sm:mb-8">
            {renderWord()}
          </div>
          
          {!isMobile && (
            <div className="mb-4 sm:mb-8">
              <input
                ref={inputRef}
                type="text"
                maxLength={1}
                onChange={handleGuess}
                className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-center text-xl sm:text-2xl uppercase"
                placeholder="Type a letter"
                disabled={gameStatus !== 'playing'}
              />
            </div>
          )}
          
          {renderKeyboard()}
          
          {/* Game status message */}
          <AnimatePresence>
            {gameStatus !== 'playing' && (
              <motion.div
                className="mt-4 sm:mt-8 text-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  delay: gameStatus === 'won' ? 0.5 : 1.5
                }}
              >
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: gameStatus === 'won' ? 0.8 : 1.8
                  }}
                >
                  {gameStatus === 'won' ? 'Congratulations! You won!' : 'Game Over!'}
                </motion.h2>
                <motion.p 
                  className="mb-2 sm:mb-4 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: gameStatus === 'won' ? 1.2 : 2.2 }}
                >
                  The word was: <span className="font-bold text-indigo-400">{currentWord}</span>
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gameStatus === 'won' ? 1.5 : 2.5 }}
                >
                  <motion.button
                    onClick={() => setGameStatus('intro')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Main Menu
                  </motion.button>
                  <motion.button
                    onClick={startNewGame}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-md font-medium transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play Again
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      {/* Scary effect overlay */}
      <AnimatePresence>
        {showScaryEffect && (
          <motion.div
            className="fixed inset-0 bg-red-900/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-4xl sm:text-6xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {lastGuess?.letter}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {gameStatus === 'intro' ? renderIntroScreen() : renderGameScreen()}
      </div>
    </div>
  );
};

export default TextTypingGame;
