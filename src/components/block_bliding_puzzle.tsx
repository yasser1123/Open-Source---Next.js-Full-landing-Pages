import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Properly defined types
interface Difficulty {
  name: string;
  gridSize: number;
  timeLimit: number; // in seconds
}

interface Score {
  name: string;
  moves: number;
  time: number;
  difficulty: string;
  date: string;
}

// Game states as an enum for type safety
enum GameState {
  WELCOME = 'welcome',
  PLAYING = 'playing',
  GAME_OVER = 'game_over',
  LEADERBOARD = 'leaderboard',
}

// Predefined difficulties
const DIFFICULTIES: Difficulty[] = [
  { name: 'Easy', gridSize: 3, timeLimit: 120 },
  { name: 'Medium', gridSize: 4, timeLimit: 180 },
  { name: 'Hard', gridSize: 5, timeLimit: 300 },
];

const BlockSlidingPuzzle: React.FC = () => {
  // Game state management with proper types
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [timerMode, setTimerMode] = useState<boolean>(false);
  
  // Game board state
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [scores, setScores] = useState<Score[]>([]);
  
  // Timer related state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Refs for focusing elements and handling keyboard navigation
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Constants based on current difficulty
  const gridSize = selectedDifficulty.gridSize;
  const emptyIndex = gridSize * gridSize - 1;

  // Load scores from localStorage on component mount
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('slidingPuzzleScores');
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error('Error loading scores:', error);
      // Continue with empty scores rather than crashing
    }

    // Focus the name input when the component mounts
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Timer management
  useEffect(() => {
    // Clear timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Focus game container when game starts
  useEffect(() => {
    if (gameState === GameState.PLAYING && gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, [gameState]);

  // Initialize game
  const initializeGame = useCallback((): void => {
    // Reset game data
    setMoves(0);
    setIsComplete(false);
    setElapsedTime(0);
    
    // Set up timer if in timer mode
    if (timerMode) {
      setTimeRemaining(selectedDifficulty.timeLimit);
      startTimer();
    }
    
    // Create initial ordered tiles array (0 to gridSize^2-1)
    const orderedTiles = Array.from(
      { length: gridSize * gridSize }, 
      (_, i) => i
    );
    
    // Shuffle tiles
    shuffleTiles(orderedTiles);
    
    // Change game state
    setGameState(GameState.PLAYING);
  }, [gridSize, timerMode, selectedDifficulty]);

  // Start game timer
  const startTimer = (): void => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      if (timerMode) {
        setTimeRemaining(prev => {
          // Game over when time runs out
          if (prev <= 1) {
            clearInterval(interval);
            handleGameOver(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Handle game completion
  const handleGameOver = (isWin: boolean): void => {
    // Clear any active timers
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // If player won, save score
    if (isWin) {
      const newScore: Score = {
        name: playerName || 'Anonymous',
        moves: moves,
        time: elapsedTime,
        difficulty: selectedDifficulty.name,
        date: new Date().toISOString(),
      };
      
      try {
        const updatedScores = [...scores, newScore]
          .sort((a, b) => {
            // First by difficulty (hard > medium > easy)
            const difficultyOrder = { 'Hard': 3, 'Medium': 2, 'Easy': 1 };
            const diffA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
            const diffB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
            
            if (diffB !== diffA) {
              return diffB - diffA;
            }
            
            // Then by fewest moves
            if (a.moves !== b.moves) {
              return a.moves - b.moves;
            }
            
            // Then by fastest time
            return a.time - b.time;
          })
          .slice(0, 10); // Keep only top 10 scores
        
        setScores(updatedScores);
        localStorage.setItem('slidingPuzzleScores', JSON.stringify(updatedScores));
      } catch (error) {
        console.error('Error saving scores:', error);
      }
    }
    
    setGameState(GameState.GAME_OVER);
  };

  // Check if a puzzle configuration is solvable
  const isPuzzleSolvable = (puzzle: number[]): boolean => {
    // Count inversions
    let inversions = 0;
    const puzzleWithoutEmpty = puzzle.filter(tile => tile !== emptyIndex);
    
    for (let i = 0; i < puzzleWithoutEmpty.length; i++) {
      for (let j = i + 1; j < puzzleWithoutEmpty.length; j++) {
        if (puzzleWithoutEmpty[i] > puzzleWithoutEmpty[j]) {
          inversions++;
        }
      }
    }
    
    // For odd-sized grids, puzzle is solvable if inversions is even
    if (gridSize % 2 === 1) {
      return inversions % 2 === 0;
    }
    
    // For even-sized grids, puzzle is solvable if:
    // (inversions + row of empty from bottom) is odd
    const emptyPosition = puzzle.indexOf(emptyIndex);
    const emptyRow = Math.floor(emptyPosition / gridSize);
    const rowFromBottom = gridSize - emptyRow;
    
    return (inversions + rowFromBottom) % 2 === 1;
  };

  // Shuffle tiles using legal moves to ensure puzzle is solvable
  const shuffleTiles = (initialTiles: number[] = [...tiles]): void => {
    // Create a copy to shuffle
    let shuffled = [...initialTiles];
    let attempts = 0;
    
    do {
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      attempts++;
      // Limit attempts to prevent infinite loop
      if (attempts > 100) {
        console.warn('Could not generate solvable puzzle in 100 attempts, using last attempt');
        break;
      }
    } while (!isPuzzleSolvable(shuffled));
    
    // Ensure puzzle is not already solved (extremely unlikely but possible)
    const isSolved = shuffled.every((tile, index) => tile === index);
    if (isSolved) {
      // Make one more swap if it's already solved
      const lastNonEmpty = (gridSize * gridSize) - 2;
      [shuffled[lastNonEmpty], shuffled[lastNonEmpty - 1]] = 
        [shuffled[lastNonEmpty - 1], shuffled[lastNonEmpty]];
    }
    
    setTiles(shuffled);
  };
  
  // Get valid moves for a given empty space position
  const getValidMoves = (emptyIndex: number, size: number): number[] => {
    const row = Math.floor(emptyIndex / size);
    const col = emptyIndex % size;
    
    // Check all four directions (up, right, down, left)
    const moves: number[] = [];
    
    // Up
    if (row > 0) moves.push(emptyIndex - size);
    // Right
    if (col < size - 1) moves.push(emptyIndex + 1);
    // Down
    if (row < size - 1) moves.push(emptyIndex + size);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    
    return moves;
  };

  // Handle tile click
  const handleTileClick = (index: number): void => {
    if (isComplete) return;
    
    // Find empty tile position
    const emptyPosition = tiles.indexOf(emptyIndex);
    
    // Check if clicked tile is adjacent to empty space
    const validMoves = getValidMoves(emptyPosition, gridSize);
    if (!validMoves.includes(index)) return;
    
    // Make the move
    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyPosition]] = [newTiles[emptyPosition], newTiles[index]];
    
    // Update state
    setTiles(newTiles);
    setMoves(prev => prev + 1);
    
    // Check if puzzle is solved
    const isSolved = newTiles.every((tile, index) => tile === index);
    if (isSolved) {
      setIsComplete(true);
      handleGameOver(true);
    }
  };

  // Handle keyboard navigation for the puzzle
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (gameState !== GameState.PLAYING || isComplete) return;
    
    const emptyPosition = tiles.indexOf(emptyIndex);
    const row = Math.floor(emptyPosition / gridSize);
    const col = emptyPosition % gridSize;
    
    let tileToMove: number | null = null;
    
    switch (e.key) {
      case 'ArrowUp':
        if (row < gridSize - 1) {
          tileToMove = emptyPosition + gridSize;
        }
        break;
      case 'ArrowDown':
        if (row > 0) {
          tileToMove = emptyPosition - gridSize;
        }
        break;
      case 'ArrowLeft':
        if (col < gridSize - 1) {
          tileToMove = emptyPosition + 1;
        }
        break;
      case 'ArrowRight':
        if (col > 0) {
          tileToMove = emptyPosition - 1;
        }
        break;
      default:
        return; // Don't handle other keys
    }
    
    if (tileToMove !== null) {
      e.preventDefault();
      handleTileClick(tileToMove);
    }
  };

  // Function to get specific styles for a tile
  const getTileStyle = (value: number): string => {
    // Don't style the empty tile
    if (value === emptyIndex) return 'bg-transparent';
    
    // Different color palettes based on difficulty
    const colorPalettes: Record<string, string[]> = {
      Easy: [
        'bg-gradient-to-br from-blue-400 to-blue-600',
        'bg-gradient-to-br from-purple-400 to-purple-600',
        'bg-gradient-to-br from-green-400 to-green-600',
        'bg-gradient-to-br from-yellow-400 to-yellow-600',
        'bg-gradient-to-br from-red-400 to-red-600',
        'bg-gradient-to-br from-indigo-400 to-indigo-600',
        'bg-gradient-to-br from-pink-400 to-pink-600',
        'bg-gradient-to-br from-teal-400 to-teal-600',
      ],
      Medium: [
        'bg-gradient-to-br from-blue-500 to-indigo-600',
        'bg-gradient-to-br from-purple-500 to-pink-600',
        'bg-gradient-to-br from-green-500 to-teal-600',
        'bg-gradient-to-br from-yellow-500 to-amber-600',
        'bg-gradient-to-br from-red-500 to-rose-600',
      ],
      Hard: [
        'bg-gradient-to-br from-indigo-600 to-purple-800',
        'bg-gradient-to-br from-blue-600 to-indigo-800',
        'bg-gradient-to-br from-emerald-600 to-teal-800',
      ]
    };
    
    const palette = colorPalettes[selectedDifficulty.name] || colorPalettes.Easy;
    return palette[value % palette.length];
  };

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render the welcome screen with player name input and game options
  const renderWelcomeScreen = (): JSX.Element => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      role="region"
      aria-label="Welcome to Sliding Puzzle Game"
    >
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 text-white text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sliding Puzzle</h1>
        <p className="text-violet-200">Challenge your mind with this classic puzzle game</p>
      </div>
      
      <div className="p-4 sm:p-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (playerName.trim()) {
            initializeGame();
          }
        }}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playerName">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              ref={nameInputRef}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-required="true"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((difficulty) => (
                <button
                  key={difficulty.name}
                  type="button"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`flex-1 min-w-[80px] py-2 px-2 rounded text-sm font-medium transition-colors ${
                    selectedDifficulty.name === difficulty.name
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  aria-pressed={selectedDifficulty.name === difficulty.name ? "true" : "false"}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {selectedDifficulty.name}: {selectedDifficulty.gridSize}×{selectedDifficulty.gridSize} grid
            </p>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={timerMode}
                onChange={() => setTimerMode(!timerMode)}
                className="rounded text-violet-600 focus:ring-violet-500 mr-2"
                aria-label="Enable timer mode"
              />
              <span className="text-gray-700 text-sm">
                Timer Mode ({formatTime(selectedDifficulty.timeLimit)})
              </span>
            </label>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!playerName.trim()}
              className={`w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg ${
                !playerName.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-violet-700 hover:to-indigo-700'
              }`}
              aria-disabled={!playerName.trim() ? "true" : "false"}
            >
              Let's Play!
            </button>
            
            <button
              type="button"
              onClick={() => setGameState(GameState.LEADERBOARD)}
              className="w-full sm:w-1/3 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Scores
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );

  // Render the game
  const renderGame = (): JSX.Element => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      role="region"
      aria-label="Sliding Puzzle Game Board"
    >
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Sliding Puzzle</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                  setGameState(GameState.WELCOME);
                }
              }}
              className="text-xs bg-white/20 p-1 px-2 rounded hover:bg-white/30 transition-colors"
              aria-label="Back to menu"
            >
              Menu
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-white/20 rounded py-1 px-3 text-sm">
            <span className="font-medium">Moves:</span> {moves}
          </div>
          <div className="bg-white/20 rounded py-1 px-3 text-sm">
            <span className="font-medium">
              {timerMode ? 'Time Left:' : 'Time:'}
            </span>{' '}
            {timerMode ? formatTime(timeRemaining) : formatTime(elapsedTime)}
          </div>
        </div>
      </div>
      
      <div 
        className="p-4"
        ref={gameContainerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`${gridSize}x${gridSize} sliding puzzle. Use arrow keys to move tiles.`}
      >
        <div 
          className="aspect-square bg-gray-100 rounded-lg p-2 border-2 border-gray-200"
        >
          <div 
            className="grid gap-1 h-full" 
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
            aria-label="Puzzle grid"
          >
            {Array.from({ length: gridSize }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid-row">
                {tiles.slice(rowIndex * gridSize, (rowIndex + 1) * gridSize).map((value, colIndex) => {
                  const index = rowIndex * gridSize + colIndex;
                  // Calculate position for aria-label
                  const row = rowIndex + 1;
                  const col = colIndex + 1;
                  
  return (
                    <motion.div
                      key={value}
                      layout
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      onClick={() => handleTileClick(index)}
                      className={`
                        rounded-lg flex items-center justify-center
                        ${value === emptyIndex 
                          ? 'opacity-0' 
                          : `${getTileStyle(value)} cursor-pointer shadow-md focus:ring-2 focus:ring-white focus:ring-offset-2`
                        }
                      `}
                      role="button"
                      tabIndex={value !== emptyIndex ? 0 : -1}
                      aria-label={value !== emptyIndex ? 
                        `Tile ${value + 1}, Row ${row}, Column ${col}` : 
                        "Empty space"
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTileClick(index);
                        }
                      }}
                    >
                      {value !== emptyIndex && (
                        <span className="text-white font-bold" style={{
                          fontSize: gridSize <= 3 ? '1.5rem' : gridSize <= 4 ? '1.25rem' : '1rem'
                        }}>
                          {value + 1}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mt-4 gap-2">
          <button
            onClick={() => shuffleTiles()}
            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            aria-label="Shuffle puzzle"
          >
            Shuffle
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to restart?')) {
                initializeGame();
              }
            }}
            className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
            aria-label="Restart game"
          >
            Restart
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Render the game over screen
  const renderGameOver = (): JSX.Element => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      role="region"
      aria-label="Game over screen"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-1" role="alert">Puzzle Solved!</h1>
        <p className="text-green-100">Congratulations {playerName || 'Anonymous'}!</p>
      </div>
      
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Moves</p>
              <p className="text-2xl font-bold text-gray-800">{moves}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">Time</p>
              <p className="text-2xl font-bold text-gray-800">{formatTime(elapsedTime)}</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">Difficulty</p>
            <p className="font-medium text-gray-800">{selectedDifficulty.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => initializeGame()}
            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:from-violet-700 hover:to-indigo-700 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => setGameState(GameState.LEADERBOARD)}
            className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Leaderboard
          </button>
        </div>
        
        <button
          onClick={() => setGameState(GameState.WELCOME)}
          className="w-full mt-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </motion.div>
  );

  // Render the leaderboard screen
  const renderLeaderboard = (): JSX.Element => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      role="region"
      aria-label="Leaderboard"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white">
        <h1 className="text-2xl font-bold text-center">Leaderboard</h1>
      </div>
      
      <div className="p-4">
        {scores.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moves
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scores.map((score, index) => (
                  <tr key={index} className={index === 0 ? "bg-amber-50" : ""}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {score.name}
                      {index === 0 && <span className="ml-1" role="img" aria-label="Top score">👑</span>}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {score.moves}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(score.time)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {score.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500" aria-live="polite">
            No scores yet. Be the first to solve the puzzle!
          </div>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {gameState === GameState.GAME_OVER ? (
            <button
              onClick={() => initializeGame()}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:from-violet-700 hover:to-indigo-700 transition-colors"
            >
              Play Again
            </button>
          ) : null}
          
          <button
            onClick={() => setGameState(GameState.WELCOME)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Menu
          </button>
        </div>
        
        {scores.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all scores?')) {
                setScores([]);
                localStorage.removeItem('slidingPuzzleScores');
              }
            }}
            className="mt-4 w-full py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
            aria-label="Clear all scores"
          >
            Clear All Scores
          </button>
        )}
      </div>
    </motion.div>
  );

  // Render falling confetti effect when game is won
  const renderConfetti = (): JSX.Element | null => {
    if (gameState !== GameState.GAME_OVER || !isComplete) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
        <style>
          {`
            @keyframes fall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            .fall-animation {
              animation: fall 3s linear forwards;
            }
          `}
        </style>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              Math.random() > 0.5 ? 'bg-yellow-400' : 'bg-pink-400'
            } fall-animation`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  };

  // Main render based on game state
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {renderConfetti()}
      <AnimatePresence mode="wait">
        {gameState === GameState.WELCOME && renderWelcomeScreen()}
        {gameState === GameState.PLAYING && renderGame()}
        {gameState === GameState.GAME_OVER && renderGameOver()}
        {gameState === GameState.LEADERBOARD && renderLeaderboard()}
      </AnimatePresence>
    </div>
  );
};

export default BlockSlidingPuzzle;
