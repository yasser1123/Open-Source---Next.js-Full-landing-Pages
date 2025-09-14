"use client"
import { useState, useEffect } from 'react';
import { X, Circle, Trophy, Target, Zap, Brain, Clock, RefreshCw } from 'lucide-react';

const gameModes = [
{ id: 'classic', name: 'Classic Mode', description: 'Traditional Tic-Tac-Toe experience' },
{ id: 'speed', name: 'Speed Mode', description: 'Beat the clock with timed moves' },
{ id: 'challenge', name: 'Challenge Mode', description: 'Play against our unbeatable AI' },
];

type ScoreType = {
  X: number;
  O: number;
  ties: number;
  [key: string]: number; // Add index signature
};

const TicTacToe = () => {
const [gameMode, setGameMode] = useState(gameModes[0].id);
const [board, setBoard] = useState(Array(9).fill(''));
const [currentTurn, setCurrentTurn] = useState('X');
const [gameOver, setGameOver] = useState(false);
const [winner, setWinner] = useState('');
const [winningCombo, setWinningCombo] = useState<number[]>([]);
const [timer, setTimer] = useState(30);
const [gameStarted, setGameStarted] = useState(false);
const [score, setScore] = useState<ScoreType>({ X: 0, O: 0, ties: 0 });
const [difficulty, setDifficulty] = useState('easy');
const [showConfetti, setShowConfetti] = useState(false);

useEffect(() => {
if (gameMode === 'speed' && gameStarted && !gameOver) {
const interval = setInterval(() => {
setTimer((prevTimer) => {
if (prevTimer <= 1) {
clearInterval(interval);
handleTimeOut();
return 0;
}
return prevTimer - 1;
});
}, 1000);
return () => clearInterval(interval);
}
}, [gameMode, gameStarted, gameOver]);

useEffect(() => {
if (showConfetti) {
const timeout = setTimeout(() => setShowConfetti(false), 4000);
return () => clearTimeout(timeout);
}
}, [showConfetti]);

const handleTimeOut = () => {
setGameOver(true);
setWinner(currentTurn === 'X' ? 'O' : 'X');
setScore((prevScore) => ({
...prevScore,
[currentTurn === 'X' ? 'O' : 'X']: prevScore[currentTurn === 'X' ? 'O' : 'X'] + 1,
}));
};

const handleMove = (index: number) => {
if (gameOver || board[index] !== '') return;
if (!gameStarted) setGameStarted(true);

const newBoard = [...board];
newBoard[index] = currentTurn;
setBoard(newBoard);

if (checkWinner(newBoard)) {
  setGameOver(true);
  setWinner(currentTurn);
  setScore((prevScore) => ({
    ...prevScore,
    [currentTurn]: prevScore[currentTurn] + 1,
  }));
  setShowConfetti(true);
  return;
}

if (newBoard.every((cell) => cell !== '')) {
  setGameOver(true);
  setScore((prevScore) => ({ ...prevScore, ties: prevScore.ties + 1 }));
  return;
}

setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');

if (gameMode === 'challenge' && currentTurn === 'X') {
  setTimeout(() => {
    const bestMove = getBestMove(newBoard, difficulty);
    if (bestMove !== null) {
      const updatedBoard = [...newBoard];
      updatedBoard[bestMove] = 'O';
      setBoard(updatedBoard);
      if (checkWinner(updatedBoard)) {
        setGameOver(true);
        setWinner('O');
        setScore((prevScore) => ({
          ...prevScore,
          O: prevScore.O + 1,
        }));
      } else if (updatedBoard.every((cell) => cell !== '')) {
        setGameOver(true);
        setScore((prevScore) => ({ ...prevScore, ties: prevScore.ties + 1 }));
      } else {
        setCurrentTurn('X');
      }
    }
  }, 500);
}
};

const getBestMove = (newBoard: string[], difficulty: string): number | null => {
if (difficulty === 'easy') {
const emptyCells = newBoard.map((cell, index) => (cell === '' ? index : null)).filter((index) => index !== null);
return emptyCells[Math.floor(Math.random() * emptyCells.length)] as number;
}
const minimax = (board: string[], depth: number, isMaximizing: boolean): number => {
    const scores: { [key: string]: number } = {
      X: -10,
      O: 10,
      tie: 0,
    };
  
    const winner = checkWinnerMinimax(board);
    if (winner !== null) return scores[winner];
  
    if (board.every((cell) => cell !== '')) return scores.tie;
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };
  
  const checkWinnerMinimax = (board: string[]): string | null => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const combination of winningCombinations) {
      if (board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]] && board[combination[0]] !== '') {
        return board[combination[0]];
      }
    }
    return null;
  };
  
  let bestScore = -Infinity;
  let bestMove: number | null = null;
  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i] === '') {
      newBoard[i] = 'O';
      const score = minimax(newBoard, 0, false);
      newBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

const checkWinner = (newBoard: string[]): boolean => {
const winningCombinations = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6],
];
for (const combination of winningCombinations) {
    if (newBoard[combination[0]] === newBoard[combination[1]] && newBoard[combination[1]] === newBoard[combination[2]] && newBoard[combination[0]] !== '') {
      setWinningCombo(combination);
      return true;
    }
  }
  return false;
};

const handleRestart = () => {
setBoard(Array(9).fill(''));
setGameOver(false);
setWinner('');
setGameStarted(false);
setTimer(30);
setShowConfetti(false);
setWinningCombo([]);
};

const handleResetScores = () => {
setScore({ X: 0, O: 0, ties: 0 });
};

const pulseAnimation = `
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.animate-pulse {
  animation: pulse 0.5s ease-in-out;
}

@keyframes fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
.animate-fall {
  animation: fall 3s linear forwards;
}
`;

const renderConfetti = () => {
return [...Array(100)].map((_, i) => (
<div
key={i}
className={`absolute w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-yellow-400' : 'bg-pink-400'} animate-fall`}
style={{
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
animationDuration: `${Math.random() * 3 + 2}s`,
animationDelay: `${Math.random() * 0.5}s`,
}}
/>
));
};

return (
<div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 flex flex-col items-center justify-center p-4">
<style>{pulseAnimation}</style>
{showConfetti && (
<div className="fixed inset-0 pointer-events-none z-50">
{renderConfetti()}
</div>
)}
<div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative z-10">
<div className="p-8">
<div className="flex flex-col md:flex-row items-center justify-between mb-8">
<div className="text-center md:text-left mb-4 md:mb-0">
<h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent">
Tic Tac Toe
</h1>
<p className="text-white/80 mt-2">Strategize, compete, and conquer!</p>
</div>
<div className="flex space-x-4">
<button
onClick={handleRestart}
className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
>
<RefreshCw size={20} />
<span>New Game</span>
</button>
<button
onClick={handleResetScores}
className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
>
<Target size={20} />
<span>Reset Scores</span>
</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Trophy size={20} className="mr-2" />
            Scoreboard
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <X size={20} className="text-purple-400" />
                <span className="text-white font-medium">Player X</span>
              </div>
              <span className="text-white font-bold text-lg">{score.X}</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Circle size={20} className="text-blue-400" />
                <span className="text-white font-medium">Player O</span>
              </div>
              <span className="text-white font-bold text-lg">{score.O}</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <RefreshCw size={20} className="text-gray-400" />
                <span className="text-white font-medium">Ties</span>
              </div>
              <span className="text-white font-bold text-lg">{score.ties}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap size={20} className="mr-2" />
            Game Mode
          </h2>
          <div className="space-y-3">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setGameMode(mode.id);
                  handleRestart();
                }}
                className={`w-full flex flex-col items-start space-y-2 p-4 rounded-lg transition-all duration-300 border ${
                  gameMode === mode.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${gameMode === mode.id ? 'bg-purple-400' : 'bg-white/20'}`} />
                  <span className="text-white font-medium">{mode.name}</span>
                </div>
                <span className="text-white/80 text-sm">{mode.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Brain size={20} className="mr-2" />
            Difficulty
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => setDifficulty('easy')}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                difficulty === 'easy'
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } border`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${difficulty === 'easy' ? 'bg-purple-400' : 'bg-white/20'}`} />
                <span className="text-white font-medium">Easy</span>
              </div>
              <span className="text-white/80 text-sm">Fun for beginners</span>
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                difficulty === 'hard'
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } border`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${difficulty === 'hard' ? 'bg-purple-400' : 'bg-white/20'}`} />
                <span className="text-white font-medium">Hard</span>
              </div>
              <span className="text-white/80 text-sm">Challenge mode</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white flex items-center">
              {gameMode === 'classic' && <Target size={20} className="mr-2" />}
              {gameMode === 'speed' && <Clock size={20} className="mr-2" />}
              {gameMode === 'challenge' && <Brain size={20} className="mr-2" />}
              Current Game: <span className="text-purple-400 ml-2">{gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode</span>
            </h2>
            {gameMode === 'speed' && (
              <p className="text-white/80 mt-2">
                Timer: <span className="font-bold text-lg">{timer}s</span>
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentTurn === 'X' ? 'bg-purple-500/40' : 'bg-white/10'}`}>
              <X size={20} className={`transition-all duration-300 ${currentTurn === 'X' ? 'text-purple-300 animate-pulse' : 'text-white/80'}`} />
              <span className={`font-medium ${currentTurn === 'X' ? 'text-purple-300' : 'text-white/80'}`}>Player X</span>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentTurn === 'O' ? 'bg-blue-500/40' : 'bg-white/10'}`}>
              <Circle size={20} className={`transition-all duration-300 ${currentTurn === 'O' ? 'text-blue-300 animate-pulse' : 'text-white/80'}`} />
              <span className={`font-medium ${currentTurn === 'O' ? 'text-blue-300' : 'text-white/80'}`}>Player O</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => handleMove(index)}
              className={`flex items-center justify-center bg-white/10 rounded-xl aspect-square transition-all duration-300 cursor-pointer
                ${gameOver || board[index] !== '' ? 'cursor-not-allowed opacity-80' : 'hover:bg-white/20 hover:scale-105'}
                ${winningCombo.includes(index) ? 'ring-2 ring-purple-500/50 animate-pulse' : ''}`}
            >
              {cell === 'X' ? (
                <X
                  size={40}
                  className={`transition-all duration-300 ${winner === 'X' ? 'text-purple-400 animate-pulse' : 'text-purple-600'}
                    ${winningCombo.includes(index) ? 'animate-pulse' : ''}`}
                />
              ) : cell === 'O' ? (
                <Circle
                  size={40}
                  className={`transition-all duration-300 ${winner === 'O' ? 'text-blue-400 animate-pulse' : 'text-blue-600'}
                    ${winningCombo.includes(index) ? 'animate-pulse' : ''}`}
                />
              ) : null}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="flex flex-col items-center justify-center py-6">
            <h3 className="text-2xl font-bold text-white mb-4 animate-bounce">
              {winner ? (
                <span>
                  Player <span className={winner === 'X' ? 'text-purple-400' : 'text-blue-400'}>{winner}</span> Wins!
                </span>
              ) : (
                "It's a Tie!"
              )}
            </h3>
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
            >
              <RefreshCw size={20} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
);
};

export default TicTacToe;
