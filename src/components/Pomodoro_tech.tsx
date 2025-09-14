'use client';

import React, { useState, useEffect, useRef } from 'react';

// Define the task type
interface Task {
  id: string;
  title: string;
  completed: boolean;
  notes: string;
  pomodoros: number;
  pomodorosCompleted: number;
}

// Define the timer settings type
interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

// Pomodoro states
type TimerType = 'pomodoro' | 'shortBreak' | 'longBreak';

// Define the Pomodoro component
const PomodoroTech: React.FC = () => {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  // State for timer
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    pomodoro: 25 * 60, // 25 minutes in seconds
    shortBreak: 5 * 60, // 5 minutes in seconds
    longBreak: 15 * 60, // 15 minutes in seconds
    longBreakInterval: 4
  });
  const [timerType, setTimerType] = useState<TimerType>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(timerSettings.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [_, setPomodorosCompleted] = useState(0);
  
  // State for UI
  const [mode, setMode] = useState<'tasks' | 'focus'>('tasks');
  const [showSettings, setShowSettings] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize audio for timer completion
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);
  
  // Timer functionality
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.error('Error playing audio:', e));
            }
            
            // Handle timer completion based on type
            if (timerType === 'pomodoro') {
              // Increment pomodoro count
              setPomodorosCompleted(prev => {
                const newCount = prev + 1;
                
                // Update active task's pomodoro count
                if (activeTaskId) {
                  setTasks(tasks.map(task => 
                    task.id === activeTaskId 
                      ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 } 
                      : task
                  ));
                }
                
                // Determine next timer type
                if (newCount % timerSettings.longBreakInterval === 0) {
                  switchTimerType('longBreak');
                } else {
                  switchTimerType('shortBreak');
                }
                
                return newCount;
              });
            } else {
              // Break completed, go back to pomodoro
              switchTimerType('pomodoro');
            }
            
            return 0; // Reset to 0 momentarily
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timerType, activeTaskId, tasks, timerSettings.longBreakInterval]);
  
  // Switch timer type function
  const switchTimerType = (type: TimerType) => {
    setIsRunning(false);
    setTimerType(type);
    setTimeLeft(timerSettings[type]);
  };
  
  // Format time function
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Task management functions
  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      notes: '',
      pomodoros: 1,
      pomodorosCompleted: 0
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };
  
  const updateTaskPomodoros = (id: string, value: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, pomodoros: Math.max(1, value) } : task
    ));
  };
  
  const startFocusMode = (taskId: string) => {
    setActiveTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setNotes(task.notes);
    }
    switchTimerType('pomodoro');
    setIsRunning(false);
    setMode('focus');
  };
  
  const saveNotes = () => {
    if (activeTaskId) {
      setTasks(tasks.map(task => 
        task.id === activeTaskId ? { ...task, notes } : task
      ));
    }
  };
  
  // Calculate progress percentage for the timer
  const timerProgress = (timeLeft / timerSettings[timerType]) * 100;
  
  // Get active task
  const activeTask = tasks.find(task => task.id === activeTaskId);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight">Pomodoro Flow</h1>
          <p className="text-blue-200 mt-2 font-light">Master your time, embrace deep work</p>
        </header>
        
        {/* Main content */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          {/* Tab navigation */}
          <div className="flex border-b border-slate-700">
            <button 
              className={`flex-1 py-4 font-medium transition-colors ${mode === 'tasks' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-blue-200 hover:text-white'}`}
              onClick={() => setMode('tasks')}
            >
              Tasks
            </button>
            <button 
              className={`flex-1 py-4 font-medium transition-colors ${mode === 'focus' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-blue-200 hover:text-white'}`}
              onClick={() => activeTaskId ? setMode('focus') : null}
              disabled={!activeTaskId}
            >
              Focus Mode
            </button>
          </div>
          
          {/* Tasks View */}
          {mode === 'tasks' && (
            <div className="p-6">
              <div className="flex mb-6">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="flex-1 p-3 bg-slate-700 border-0 rounded-l-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={addTask}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-r-lg hover:bg-emerald-600 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-slate-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-lg">No tasks yet. Add your first task to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`border rounded-xl p-5 transition-all ${task.completed ? 'bg-slate-700/40 border-slate-600' : 'bg-slate-700 border-slate-600 hover:border-emerald-400/50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            title={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="mt-1 h-5 w-5 text-emerald-500 rounded-sm bg-slate-600 border-slate-500 focus:ring-emerald-400 focus:ring-offset-slate-800"
                          />
                          <div>
                            <label htmlFor={`task-${task.id}`} className={`font-medium text-lg ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </label>
                            <div className="flex items-center mt-2 text-sm text-slate-300">
                              <span className="mr-4 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {task.pomodorosCompleted}/{task.pomodoros}
                              </span>
                              <div className="flex items-center bg-slate-600 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => updateTaskPomodoros(task.id, task.pomodoros - 1)}
                                  className="h-7 w-7 flex items-center justify-center text-slate-300 hover:bg-slate-500 transition"
                                >
                                  -
                                </button>
                                <span className="mx-3 text-slate-200">{task.pomodoros}</span>
                                <button
                                  onClick={() => updateTaskPomodoros(task.id, task.pomodoros + 1)}
                                  className="h-7 w-7 flex items-center justify-center text-slate-300 hover:bg-slate-500 transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startFocusMode(task.id)}
                            disabled={task.completed}
                            className={`px-3 py-1 rounded-md flex items-center ${task.completed ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Focus
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 rounded-md flex items-center bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Focus Mode View */}
          {mode === 'focus' && activeTask && (
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="relative mx-auto w-72 h-72 mb-8">
                  {/* Background circle */}
                  <div className="absolute inset-0 rounded-full bg-slate-700"></div>
                  
                  {/* Progress circle */}
                  <div 
                    className="absolute inset-0 rounded-full transition-all duration-300"
                    style={{ 
                      background: `conic-gradient(from 0deg, ${
                        timerType === 'pomodoro' 
                          ? '#10b981' // emerald-500
                          : timerType === 'shortBreak'
                            ? '#0ea5e9' // sky-500
                            : '#8b5cf6' // violet-500
                      } ${timerProgress}%, transparent ${timerProgress}%)` 
                    }}
                  ></div>
                  
                  {/* Inner circle */}
                  <div className="absolute inset-2 rounded-full bg-slate-800 flex items-center justify-center">
                    <div className="text-center z-10">
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">{formatTime(timeLeft)}</div>
                      <div className="text-sm text-blue-200 mt-2 uppercase tracking-widest font-light">{timerType}</div>
                    </div>
                  </div>
                  
                  {/* Pulse animation when timer is running */}
                  {isRunning && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{
                        background: timerType === 'pomodoro' 
                          ? 'rgba(16, 185, 129, 0.1)' // emerald with low opacity
                          : timerType === 'shortBreak'
                            ? 'rgba(14, 165, 233, 0.1)' // sky with low opacity
                            : 'rgba(139, 92, 246, 0.1)' // violet with low opacity
                      }}
                    ></div>
                  )}
                </div>
                
                <div className="flex justify-center gap-3 mb-8">
                  <button
                    onClick={() => switchTimerType('pomodoro')}
                    className={`px-5 py-2 rounded-full font-medium transition-all ${
                      timerType === 'pomodoro' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => switchTimerType('shortBreak')}
                    className={`px-5 py-2 rounded-full font-medium transition-all ${
                      timerType === 'shortBreak' 
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Short Break
                  </button>
                  <button
                    onClick={() => switchTimerType('longBreak')}
                    className={`px-5 py-2 rounded-full font-medium transition-all ${
                      timerType === 'longBreak' 
                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Long Break
                  </button>
                </div>
                
                <div className="mb-8">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-10 py-4 rounded-full font-medium text-white shadow-lg transition-all ${
                      isRunning 
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                        : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                    }`}
                  >
                    {isRunning ? 'Pause' : 'Start'}
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-700 p-5 rounded-xl mb-6 border border-slate-600">
                <h2 className="text-lg font-medium text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Current Task
                </h2>
                <p className="text-blue-100 text-lg">{activeTask.title}</p>
                <div className="mt-3 flex items-center text-sm text-blue-200">
                  <svg className="w-4 h-4 mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span>Progress: {activeTask.pomodorosCompleted}/{activeTask.pomodoros} pomodoros</span>
                  
                  {/* Progress bar */}
                  <div className="ml-3 flex-1 bg-slate-600 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${(activeTask.pomodorosCompleted / activeTask.pomodoros) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Notes
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={saveNotes}
                  placeholder="Add your notes here..."
                  className="w-full h-40 p-4 bg-slate-700 border border-slate-600 rounded-xl text-blue-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>
          )}
        </div>
        
        {/* Settings button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-blue-200 hover:text-emerald-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
        
        {/* Settings modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-100">Timer Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label 
                    htmlFor="pomodoro-time"
                    className="block text-sm font-medium text-blue-200 mb-2 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Focus Duration (minutes)
                  </label>
                  <input
                    id="pomodoro-time"
                    type="number"
                    min="1"
                    max="60"
                    title="Pomodoro duration in minutes"
                    placeholder="25"
                    value={timerSettings.pomodoro / 60}
                    onChange={(e) => setTimerSettings({
                      ...timerSettings,
                      pomodoro: parseInt(e.target.value) * 60
                    })}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-blue-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="short-break-time"
                    className="block text-sm font-medium text-blue-200 mb-2 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Short Break (minutes)
                  </label>
                  <input
                    id="short-break-time"
                    type="number"
                    min="1"
                    max="30"
                    title="Short break duration in minutes"
                    placeholder="5"
                    value={timerSettings.shortBreak / 60}
                    onChange={(e) => setTimerSettings({
                      ...timerSettings,
                      shortBreak: parseInt(e.target.value) * 60
                    })}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-blue-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="long-break-time"
                    className="block text-sm font-medium text-blue-200 mb-2 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Long Break (minutes)
                  </label>
                  <input
                    id="long-break-time"
                    type="number"
                    min="1"
                    max="60"
                    title="Long break duration in minutes"
                    placeholder="15"
                    value={timerSettings.longBreak / 60}
                    onChange={(e) => setTimerSettings({
                      ...timerSettings,
                      longBreak: parseInt(e.target.value) * 60
                    })}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-blue-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="break-interval"
                    className="block text-sm font-medium text-blue-200 mb-2 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    Long Break After (sessions)
                  </label>
                  <input
                    id="break-interval"
                    type="number"
                    min="1"
                    max="10"
                    title="Number of pomodoro sessions before a long break"
                    placeholder="4"
                    value={timerSettings.longBreakInterval}
                    onChange={(e) => setTimerSettings({
                      ...timerSettings,
                      longBreakInterval: parseInt(e.target.value)
                    })}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-blue-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setTimeLeft(timerSettings[timerType]);
                    setShowSettings(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTech;
