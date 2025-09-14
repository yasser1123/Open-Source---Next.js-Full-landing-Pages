import { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define TypeScript interfaces
interface Concept {
  id: number;
  name: string;
  completed: boolean;
  dateCompleted?: string;
}

interface Roadmap {
  id: number;
  title: string;
  concepts: Concept[];
  createdAt: string;
}

interface Stats {
  completed: number;
  total: number;
  percentage: number;
}

interface ChartDataPoint {
  date: string;
  conceptsCompleted: number;
}

// Add a formatDate helper function to ensure consistent date formatting
const formatDate = (dateString: string): string => {
  // Use ISO string format (YYYY-MM-DD) for display to ensure consistency
  return dateString;
};

const ProgrammingRoadmapApp: React.FC = () => {
  // State for roadmaps
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      concepts: [
        { id: 1, name: 'Variables & Data Types', completed: true, dateCompleted: '2023-01-15' },
        { id: 2, name: 'Functions', completed: true, dateCompleted: '2023-01-20' },
        { id: 3, name: 'Objects & Arrays', completed: false },
        { id: 4, name: 'Async/Await', completed: false },
        { id: 5, name: 'DOM Manipulation', completed: false },
      ],
      createdAt: '2023-01-10',
    },
    {
      id: 2,
      title: 'React Mastery',
      concepts: [
        { id: 1, name: 'Components & Props', completed: true, dateCompleted: '2023-02-05' },
        { id: 2, name: 'Hooks (useState)', completed: true, dateCompleted: '2023-02-10' },
        { id: 3, name: 'Hooks (useEffect)', completed: false },
        { id: 4, name: 'Context API', completed: false },
        { id: 5, name: 'Custom Hooks', completed: false },
      ],
      createdAt: '2023-02-01',
    }
  ]);

  const [newRoadmapTitle, setNewRoadmapTitle] = useState<string>('');
  const [newConcept, setNewConcept] = useState<string>('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'dashboard'>('roadmap');

  // Add useEffect to handle client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate completion statistics
  const calculateStats = (roadmapId: number): Stats => {
    const roadmap = roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return { completed: 0, total: 0, percentage: 0 };

    const completed = roadmap.concepts.filter(c => c.completed).length;
    const total = roadmap.concepts.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  // Generate chart data
  const generateChartData = (): ChartDataPoint[] => {
    const roadmap = roadmaps.find(r => r.id === selectedRoadmap);
    if (!roadmap) return [];

    // Group by date for line chart
    const dateGroups: Record<string, number> = {};
    roadmap.concepts.filter(c => c.completed && c.dateCompleted).forEach(concept => {
      const date = concept.dateCompleted as string; // We know dateCompleted exists due to the filter
      if (!dateGroups[date]) {
        dateGroups[date] = 0;
      }
      dateGroups[date]++;
    });

    // Convert to array for chart
    return Object.entries(dateGroups).map(([date, count]) => ({
      date,
      conceptsCompleted: count,
    }));
  };

  // Toggle concept completion
  const toggleConceptCompletion = (roadmapId: number, conceptId: number): void => {
    setRoadmaps(roadmaps.map(roadmap => {
      if (roadmap.id === roadmapId) {
        return {
          ...roadmap,
          concepts: roadmap.concepts.map(concept => {
            if (concept.id === conceptId) {
              return {
                ...concept,
                completed: !concept.completed,
                dateCompleted: !concept.completed ? new Date().toISOString().split('T')[0] : undefined
              };
            }
            return concept;
          })
        };
      }
      return roadmap;
    }));
  };

  // Add new roadmap
  const addNewRoadmap = (): void => {
    if (newRoadmapTitle.trim() === '') return;

    const newId = roadmaps.length > 0 ? Math.max(...roadmaps.map(r => r.id)) + 1 : 1;

    setRoadmaps([
      ...roadmaps,
      {
        id: newId,
        title: newRoadmapTitle,
        concepts: [],
        createdAt: new Date().toISOString().split('T')[0]
      }
    ]);

    setNewRoadmapTitle('');
    setSelectedRoadmap(newId);
  };

  // Add concept to roadmap
  const addConceptToRoadmap = (): void => {
    if (newConcept.trim() === '') return;

    setRoadmaps(roadmaps.map(roadmap => {
      if (roadmap.id === selectedRoadmap) {
        const newId = roadmap.concepts.length > 0 
          ? Math.max(...roadmap.concepts.map(c => c.id)) + 1 
          : 1;

        return {
          ...roadmap,
          concepts: [
            ...roadmap.concepts,
            {
              id: newId,
              name: newConcept,
              completed: false
            }
          ]
        };
      }
      return roadmap;
    }));

    setNewConcept('');
  };

  // Current roadmap
  const currentRoadmap = roadmaps.find(r => r.id === selectedRoadmap);
  const stats = calculateStats(selectedRoadmap);
  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Background illumination effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-700 rounded-full filter blur-3xl"></div>
        <div className="absolute top-3/4 -right-20 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-700 rounded-full filter blur-3xl"></div>
      </div>

      {isClient ? (
        // Client-side rendered content
        <>
          {/* Hero Section */}
          <div className="relative bg-gray-900 overflow-hidden">
            {/* Motion particles */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-indigo-500 opacity-20"
                  style={{
                    width: `${Math.random() * 5 + 2}px`,
                    height: `${Math.random() * 5 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
              <div className="md:flex items-center justify-between">
                <div className="md:w-1/2 mb-12 md:mb-0">
                  <div className="inline-block mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-lg">
                    <div className="bg-gray-900 px-3 py-1 rounded-md">
                      <span className="text-white font-medium">Track Your Progress</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                      Programming Career Tracker
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-lg">
                    Visualize your programming journey, track your progress, and achieve your career goals with our interactive roadmap tracker.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => document.getElementById('roadmaps')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center"
                      type="button"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      View Roadmaps
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const element = document.getElementById('roadmaps');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all border border-gray-700 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      View Roadmaps
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const element = document.getElementById('create-roadmap');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/30"
                    >
                      Create Roadmap
                    </button>
                  </div>
                </div>
                
                <div className="md:w-1/2 relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-lg opacity-75"></div>
                  <div className="relative bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Career Progress</h3>
                      <div className="text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded text-sm">75% Complete</div>
                    </div>
                    <div className="space-y-4">
                      {['JavaScript', 'React', 'Node.js', 'TypeScript'].map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{skill}</span>
                            <span className="text-indigo-300">{[90, 75, 60, 40][index]}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${[90, 75, 60, 40][index]}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-700/60 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">4</div>
                        <div className="text-xs text-gray-400">Roadmaps</div>
                      </div>
                      <div className="bg-gray-700/60 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">24</div>
                        <div className="text-xs text-gray-400">Skills</div>
                      </div>
                      <div className="bg-gray-700/60 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">67%</div>
                        <div className="text-xs text-gray-400">Avg. Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wave divider */}
            <div className="w-full h-16 relative overflow-hidden">
              <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 24L60 28C120 32 240 40 360 50C480 60 600 72 720 70C840 68 960 52 1080 42C1200 32 1320 28 1380 26L1440 24V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0V24Z" fill="#1f2937" />
              </svg>
            </div>
          </div>

          <header className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-lg border-b border-gray-700">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Programming Career Tracker
              </h1>
              <p className="mt-2 text-gray-300">Visualize your learning progress and mastery</p>
            </div>
      </header>

          <main id="roadmaps" className="relative container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
              <div className="w-full md:w-1/4">
                <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-70">
                  <h2 className="text-xl font-semibold mb-4 text-white">Your Roadmaps</h2>
            
            <div className="flex flex-col space-y-2 mb-6">
              {roadmaps.map(roadmap => (
                <button
                  key={roadmap.id}
                  onClick={() => setSelectedRoadmap(roadmap.id)}
                        className={`p-3 rounded-lg text-left transition-all duration-200 ${
                          selectedRoadmap === roadmap.id 
                          ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-white border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20'
                          : 'bg-gray-700/40 hover:bg-gray-700/60 border-l-4 border-transparent hover:border-gray-500'
                        }`}
                        type="button"
                >
                  <h3 className="font-medium">{roadmap.title}</h3>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-gray-600 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                              style={{ width: `${calculateStats(roadmap.id).percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-300">
                            {calculateStats(roadmap.id).completed}/{calculateStats(roadmap.id).total}
                          </span>
                        </div>
                </button>
              ))}
            </div>

                  <div id="create-roadmap" className="mt-6 border-t border-gray-700 pt-6">
                    <h3 className="font-semibold mb-3 text-white">Create New Roadmap</h3>
              <div className="flex">
                <input
                  type="text"
                  value={newRoadmapTitle}
                  onChange={(e) => setNewRoadmapTitle(e.target.value)}
                  placeholder="Roadmap title"
                        className="flex-1 p-2 border bg-gray-700 border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                />
                <button
                  onClick={addNewRoadmap}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-r-md hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25"
                        type="button"
                >
                  Add
                </button>
                    </div>
              </div>
            </div>
          </div>

          {/* Main content */}
              <div className="w-full md:w-3/4">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-70">
            {/* Roadmap content tabs */}
                  <div className="flex border-b border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('roadmap')}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 'roadmap' 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 border-b-2 border-indigo-500' 
                        : 'text-gray-400 hover:text-gray-200'
                      }`}
                      type="button"
              >
                Roadmap
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 'dashboard' 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 border-b-2 border-indigo-500' 
                        : 'text-gray-400 hover:text-gray-200'
                      }`}
                      type="button"
              >
                Dashboard
              </button>
            </div>

            {currentRoadmap ? (
              <>
                <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{currentRoadmap.title}</h2>
                        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-4 py-2 rounded-full shadow-lg shadow-indigo-700/20">
                    {stats.percentage}% Complete
                  </div>
                </div>

                {activeTab === 'roadmap' && (
                  <>
                    <div className="mb-6 flex">
                      <input
                        type="text"
                        value={newConcept}
                        onChange={(e) => setNewConcept(e.target.value)}
                        placeholder="Add new concept"
                              className="flex-1 p-2 border bg-gray-700 border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                            />
                            <button
                              onClick={addConceptToRoadmap}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-r-md hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25"
                              type="button"
                            >
                              Add
                            </button>
                          </div>

                          <div className="space-y-2">
                            {currentRoadmap.concepts.length === 0 ? (
                              <p className="text-gray-400 italic">No concepts added yet. Add your first concept above.</p>
                            ) : (
                              currentRoadmap.concepts.map(concept => (
                                <div
                                  key={concept.id}
                                  className={`p-4 border rounded-lg flex justify-between items-center transition-all duration-300 ${
                                    concept.completed 
                                    ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30 shadow-lg shadow-indigo-800/10' 
                                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={concept.completed}
                                        onChange={() => toggleConceptCompletion(currentRoadmap.id, concept.id)}
                                        className="w-5 h-5 rounded bg-gray-600 border-gray-500 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                                        aria-label={`Mark ${concept.name} as completed`}
                                      />
                                      {concept.completed && (
                                        <div className="absolute -inset-1 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                                      )}
                                    </div>
                                    <span className={`ml-3 ${concept.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                      {concept.name}
                                    </span>
                                  </div>
                                  {concept.completed && concept.dateCompleted && (
                                    <span className="text-xs text-gray-400 flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {formatDate(concept.dateCompleted)}
                                    </span>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </>
                      )}

                      {activeTab === 'dashboard' && (
                        <>
                          <div className="space-y-6">
                            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-6 rounded-xl border border-gray-700">
                              <h3 className="font-semibold text-lg mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Progress Summary
                              </h3>
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700">
                                  <p className="text-gray-400 text-sm">Completed</p>
                                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                    {stats.completed}
                                  </p>
                                </div>
                                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700">
                                  <p className="text-gray-400 text-sm">Total</p>
                                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                    {stats.total}
                                  </p>
                                </div>
                                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700">
                                  <p className="text-gray-400 text-sm">Completion</p>
                                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                    {stats.percentage}%
                                  </p>
                                </div>
                              </div>
                            </div>

                            {chartData.length > 0 ? (
                              <>
                                <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-6 rounded-xl border border-gray-700">
                                  <h3 className="font-semibold text-lg mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                    Completion Timeline
                                  </h3>
                                  <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart
                                        data={chartData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                      >
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis 
                                          dataKey="date" 
                                          stroke="#9ca3af" 
                                          tick={{ fill: '#9ca3af' }}
                                        />
                                        <YAxis 
                                          stroke="#9ca3af" 
                                          tick={{ fill: '#9ca3af' }}
                                        />
                                        <Tooltip 
                                          contentStyle={{ 
                                            backgroundColor: '#1f2937', 
                                            borderColor: '#374151',
                                            color: '#f3f4f6'
                                          }} 
                                          itemStyle={{ color: '#f3f4f6' }}
                                          labelStyle={{ color: '#f3f4f6' }}
                                        />
                                        <Legend />
                                        <defs>
                                          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                          </linearGradient>
                                        </defs>
                                        <Line
                                          type="monotone"
                                          dataKey="conceptsCompleted"
                                          name="Concepts Completed"
                                          stroke="#4f46e5"
                                          strokeWidth={3}
                                          fill="url(#colorGradient)"
                                          dot={{ r: 4, strokeWidth: 2, stroke: "#8b5cf6", fill: "#4f46e5" }}
                                          activeDot={{ r: 8, strokeWidth: 0, fill: "#8b5cf6" }}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>

                                <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-6 rounded-xl border border-gray-700">
                                  <h3 className="font-semibold text-lg mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                    Concepts Completion
                                  </h3>
                                  <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart
                                        data={chartData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                      >
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                        <XAxis 
                                          dataKey="date" 
                                          stroke="#9ca3af" 
                                          tick={{ fill: '#9ca3af' }}
                                        />
                                        <YAxis 
                                          stroke="#9ca3af" 
                                          tick={{ fill: '#9ca3af' }}
                                        />
                                        <Tooltip 
                                          contentStyle={{ 
                                            backgroundColor: '#1f2937', 
                                            borderColor: '#374151',
                                            color: '#f3f4f6'
                                          }}
                                          itemStyle={{ color: '#f3f4f6' }}
                                          labelStyle={{ color: '#f3f4f6' }}
                                        />
                                        <Legend />
                                        <defs>
                                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                                          </linearGradient>
                                        </defs>
                                        <Bar
                                          dataKey="conceptsCompleted"
                                          name="Concepts Completed"
                                          fill="url(#barGradient)"
                                          radius={[4, 4, 0, 0]}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-800 to-purple-800 flex items-center justify-center shadow-lg shadow-indigo-700/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                  </div>
                                  <p className="text-gray-300">No completion data available yet.</p>
                                  <p className="text-gray-400 text-sm">Mark some concepts as completed to see your progress visualization.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-800 to-purple-800 flex items-center justify-center shadow-lg shadow-indigo-700/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white">No Roadmap Selected</h3>
                        <p className="text-gray-400">Select a roadmap or create a new one to get started.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </>
      ) : (
        // Server-side rendered fallback
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
          <div className="text-center z-10">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Programming Career Tracker
            </h1>
            <p className="mt-2 text-gray-400">Loading your roadmaps...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammingRoadmapApp;