'use client';

import React, { useState, useEffect } from 'react';

// Cell types
type CellType = 'wall' | 'path' | 'player' | 'coin' | 'exit' | 'trap' | 'key' | 'door';

// Direction type
type Direction = 'up' | 'down' | 'left' | 'right';

// Game levels
const LEVELS = [
  {
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'player', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'wall', 'coin', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'coin', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'coin', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'exit', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    name: 'Level 1: Beginner Maze',
  },
  {
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'player', 'path', 'path', 'path', 'path', 'path', 'wall', 'coin', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'coin', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'path', 'path', 'path', 'path', 'coin', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'coin', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'coin', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'exit', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    name: 'Level 2: Advanced Pathways',
  },
  {
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'player', 'path', 'path', 'path', 'wall', 'coin', 'wall', 'path', 'coin', 'wall', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'path', 'wall', 'trap', 'coin', 'trap', 'wall'],
      ['wall', 'coin', 'path', 'path', 'path', 'wall', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'trap', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'key', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'coin', 'path', 'path', 'path', 'door', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'trap', 'trap', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'coin', 'path', 'coin', 'path', 'exit', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    name: 'Level 3: Dangerous Traps',
  },
  {
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'player', 'path', 'path', 'path', 'path', 'wall', 'coin', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'key', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'path', 'path', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'coin', 'path', 'wall', 'path', 'trap', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall'],
      ['wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'door', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'trap', 'path', 'path', 'path', 'path', 'path', 'wall', 'coin', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall'],
      ['wall', 'coin', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'coin', 'exit', 'wall'],
      ['wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall'],
      ['wall', 'path', 'path', 'wall', 'path', 'wall', 'coin', 'path', 'wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    name: 'Level 4: Key Master',
  },
  {
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'player', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'key', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'coin', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'key', 'path', 'path', 'exit', 'path', 'wall', 'coin', 'wall', 'path', 'path', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'wall', 'wall', 'door', 'wall', 'path', 'wall', 'coin', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'path', 'path', 'path', 'path', 'path', 'wall', 'coin', 'wall', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'path', 'wall', 'wall', 'wall', 'trap', 'wall', 'coin', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'path', 'path', 'path', 'wall', 'path', 'wall', 'coin', 'wall', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'coin', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'wall', 'coin', 'coin', 'coin', 'wall', 'path', 'path', 'path', 'wall', 'coin', 'coin', 'coin', 'coin', 'coin', 'wall', 'door', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    name: 'Level 5: Maze Master',
  }
];

const MazeRunner: React.FC = () => {
  // Game state
  const [level, setLevel] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'victory' | 'next-level' | 'game-over'>('menu');
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [playerPosition, setPlayerPosition] = useState({ row: 0, col: 0 });
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [moves, setMoves] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  
  // Initialize maze
  const initMaze = (levelIndex: number) => {
    const levelData = LEVELS[levelIndex];
    if (!levelData) return;
    
    const newMaze = JSON.parse(JSON.stringify(levelData.map)) as CellType[][];
    
    // Find player position and count coins
    let playerRow = 0;
    let playerCol = 0;
    let totalCoinsCount = 0;
    
    for (let row = 0; row < newMaze.length; row++) {
      for (let col = 0; col < newMaze[row].length; col++) {
        if (newMaze[row][col] === 'player') {
          playerRow = row;
          playerCol = col;
          // Replace player position with path in the maze
          newMaze[row][col] = 'path';
        } else if (newMaze[row][col] === 'coin') {
          totalCoinsCount++;
        }
      }
    }
    
    setMaze(newMaze);
    setPlayerPosition({ row: playerRow, col: playerCol });
    setCoins(0);
    setTotalCoins(totalCoinsCount);
    setMoves(0);
    setHasKey(false);
    setGameState('playing');
  };
  
  // Start the game
  const startGame = () => {
    setLevel(0);
    initMaze(0);
  };
  
  // Move to next level
  const nextLevel = () => {
    if (level < LEVELS.length - 1) {
      setLevel(prev => prev + 1);
      initMaze(level + 1);
    } else {
      // No more levels
      setGameState('victory');
    }
  };
  
  // Restart current level
  const restartLevel = () => {
    initMaze(level);
  };
  
  // Move player
  const movePlayer = (direction: Direction) => {
    if (gameState !== 'playing') return;
    
    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;
    
    // Calculate new position
    switch (direction) {
      case 'up':
        newRow = row - 1;
        break;
      case 'down':
        newRow = row + 1;
        break;
      case 'left':
        newCol = col - 1;
        break;
      case 'right':
        newCol = col + 1;
        break;
    }
    
    // Check if new position is valid
    if (
      newRow >= 0 && 
      newRow < maze.length && 
      newCol >= 0 && 
      newCol < maze[0].length && 
      maze[newRow][newCol] !== 'wall'
    ) {
      // Handle special cell types
      const cellType = maze[newRow][newCol];
      
      // Check for door and key
      if (cellType === 'door' && !hasKey) {
        // Cannot pass through the door without key
        return;
      }
      
      // Valid move
      setMoves(prev => prev + 1);
      
      const newMaze = [...maze];
      
      // Handle different cell types
      switch (cellType) {
        case 'coin':
          newMaze[newRow][newCol] = 'path';
          setMaze(newMaze);
          setCoins(prev => prev + 1);
          break;
        case 'key':
          newMaze[newRow][newCol] = 'path';
          setMaze(newMaze);
          setHasKey(true);
          break;
        case 'trap':
          // Player fell into a trap
          setGameState('game-over');
          return;
        case 'exit':
          setGameState('next-level');
          break;
      }
      
      // Update player position
      setPlayerPosition({ row: newRow, col: newCol });
    }
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer('down');
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer('right');
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, maze, gameState, hasKey]);
  
  // Render the cell
  const renderCell = (cell: CellType, row: number, col: number) => {
    const isPlayer = playerPosition.row === row && playerPosition.col === col;
    
    let className = 'w-8 h-8 flex items-center justify-center border border-gray-800';
    let content = null;
    
    if (isPlayer) {
      className += ' bg-blue-500 rounded-full';
      content = <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
        <span className="text-white text-xs">🧑</span>
      </div>;
    } else {
      switch (cell) {
        case 'wall':
          className += ' bg-gray-800';
          break;
        case 'path':
          className += ' bg-gray-200';
          break;
        case 'coin':
          className += ' bg-yellow-200';
          content = <div className="w-4 h-4 rounded-full bg-yellow-500">💰</div>;
          break;
        case 'exit':
          className += ' bg-green-500';
          content = <div className="text-white">🚪</div>;
          break;
        case 'trap':
          className += ' bg-red-300';
          content = <div className="text-red-800">⚠️</div>;
          break;
        case 'key':
          className += ' bg-purple-200';
          content = <div className="text-purple-800">🔑</div>;
          break;
        case 'door':
          className += ' bg-brown-500';
          content = <div className="text-white">🔒</div>;
          break;
      }
    }
    
    return (
      <div key={`${row}-${col}`} className={className}>
        {content}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-800 to-blue-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
        Maze Runner
      </h1>
      
      {gameState === 'menu' && (
        <div className="bg-gray-900 bg-opacity-80 rounded-xl p-8 shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Maze Runner!</h2>
          <p className="mb-6 text-gray-300">
            Navigate through the maze, collect coins, avoid traps, and find the exit!
          </p>
          <div className="mb-6 text-sm text-left bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2 text-yellow-400">How to Play:</h3>
            <ul className="space-y-1 text-gray-300">
              <li>• Move using arrow keys or WASD</li>
              <li>• Collect all coins for bonus points</li>
              <li>• Find keys to unlock doors</li>
              <li>• Avoid dangerous traps</li>
              <li>• Reach the exit to complete each level</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="flex flex-col items-center">
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-3 mb-6 flex flex-wrap gap-4 justify-center">
            <div>
              <span className="font-bold text-yellow-400">Level:</span> {LEVELS[level].name}
            </div>
            <div>
              <span className="font-bold text-yellow-400">Coins:</span> {coins}/{totalCoins}
            </div>
            <div>
              <span className="font-bold text-yellow-400">Moves:</span> {moves}
            </div>
            {hasKey && (
              <div>
                <span className="font-bold text-purple-400">Key:</span> 🔑
              </div>
            )}
          </div>
          
          <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg mb-6">
            <div className="grid grid-flow-row" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 1}, 1fr)` }}>
              {maze.map((row, rowIndex) => 
                row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-300 mb-4">
            Use arrow keys or WASD to move
          </div>
        </div>
      )}
      
      {gameState === 'game-over' && (
        <div className="bg-gray-900 bg-opacity-80 rounded-xl p-8 shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Game Over!</h2>
          <p className="mb-6 text-gray-300">
            You fell into a trap! Be more careful next time.
          </p>
          <div className="space-y-2 mb-6">
            <p><span className="font-bold text-yellow-400">Level:</span> {LEVELS[level].name}</p>
            <p><span className="font-bold text-yellow-400">Coins:</span> {coins}/{totalCoins}</p>
            <p><span className="font-bold text-yellow-400">Moves:</span> {moves}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={restartLevel}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Main Menu
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'next-level' && (
        <div className="bg-gray-900 bg-opacity-80 rounded-xl p-8 shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Level Complete!</h2>
          <div className="space-y-2 mb-6">
            <p><span className="font-bold text-yellow-400">Coins:</span> {coins}/{totalCoins}</p>
            <p><span className="font-bold text-yellow-400">Moves:</span> {moves}</p>
          </div>
          <button
            onClick={nextLevel}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            {level < LEVELS.length - 1 ? 'Next Level' : 'Complete Game'}
          </button>
        </div>
      )}
      
      {gameState === 'victory' && (
        <div className="bg-gray-900 bg-opacity-80 rounded-xl p-8 shadow-lg max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">Congratulations!</h2>
          <p className="mb-6 text-gray-300">
            You completed all levels of Maze Runner!
          </p>
          <button
            onClick={() => setGameState('menu')}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MazeRunner; 