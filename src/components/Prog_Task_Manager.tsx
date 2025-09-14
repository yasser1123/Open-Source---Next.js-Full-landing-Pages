'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Edit, X } from 'lucide-react';
import { z } from 'zod';

// Define types
type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Todo' | 'In Progress' | 'Completed';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  createdAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

// Form schemas
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string(),
});

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  status: z.enum(['Todo', 'In Progress', 'Completed']),
  projectId: z.string().min(1, 'Project is required'),
});

// Local storage keys
const PROJECTS_STORAGE_KEY = 'devTaskManager_projects';
const TASKS_STORAGE_KEY = 'devTaskManager_tasks';

export default function Prog_Task_Manager() {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeView, setActiveView] = useState<'board' | 'projects'>('board');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Priority,
    status: 'Todo' as Status,
    projectId: '',
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects.map((project: Record<string, unknown>) => ({
          ...project,
          createdAt: new Date(project.createdAt as string)
        })));
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
      }
    }
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks.map((task: Record<string, unknown>) => ({
          ...task,
          createdAt: new Date(task.createdAt as string)
        })));
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Handle project creation
  const handleAddProject = () => {
    try {
      projectSchema.parse(newProject);
      
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        createdAt: new Date()
      };
      
      setProjects([...projects, project]);
      setNewProject({ name: '', description: '' });
      setIsAddingProject(false);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  // Handle task creation and editing
  const handleAddOrUpdateTask = () => {
    try {
      const validatedData = taskSchema.parse(newTask);
      
      if (editingTask) {
        // Update existing task
        const updatedTasks = tasks.map(task => 
          task.id === editingTask.id ? 
            { ...task, ...validatedData } : 
            task
        );
        setTasks(updatedTasks);
      } else {
        // Create new task
        const task: Task = {
          id: Date.now().toString(),
          title: validatedData.title,
          description: validatedData.description,
          priority: validatedData.priority,
          status: validatedData.status,
          projectId: validatedData.projectId,
          createdAt: new Date()
        };
        
        setTasks([...tasks, task]);
      }
      
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        projectId: '',
      });
      setIsAddingTask(false);
      setEditingTask(null);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  // Handle task deletion
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle task editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      projectId: task.projectId,
    });
    setIsAddingTask(true);
  };

  // Handle project deletion
  const handleDeleteProject = (id: string) => {
    // Delete project
    setProjects(projects.filter(project => project.id !== id));
    
    // Delete associated tasks
    setTasks(tasks.filter(task => task.projectId !== id));
    
    // Reset selected project if needed
    if (selectedProject === id) {
      setSelectedProject('all');
    }
  };

  // Filter tasks based on selected project
  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(task => task.projectId === selectedProject);

  // Sort tasks by priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Group tasks by status
  const groupedTasks = {
    'Todo': sortedTasks.filter(task => task.status === 'Todo'),
    'In Progress': sortedTasks.filter(task => task.status === 'In Progress'),
    'Completed': sortedTasks.filter(task => task.status === 'Completed'),
  };

  // Update task status
  const updateTaskStatus = (taskId: string, newStatus: Status) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-gray-100 font-sans">
      <header className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
          DevTask Manager
        </h1>
        <p className="text-gray-300 mt-1 text-sm">
          Streamline your development workflow with efficient task management
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex mb-5 bg-white/5 p-1 rounded-lg backdrop-blur-md w-72 mx-auto">
        <button
          onClick={() => setActiveView('board')}
          className={`flex-1 py-1.5 px-3 text-sm rounded-md transition-all ${
            activeView === 'board' 
              ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300' 
              : 'text-gray-300 hover:bg-white/5'
          }`}
        >
          Task Board
        </button>
        <button
          onClick={() => setActiveView('projects')}
          className={`flex-1 py-1.5 px-3 text-sm rounded-md transition-all ${
            activeView === 'projects' 
              ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300' 
              : 'text-gray-300 hover:bg-white/5'
          }`}
        >
          Projects
        </button>
      </div>

      {/* Project Selector */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="w-60">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full p-2 text-sm rounded-lg bg-slate-800 backdrop-blur-lg border border-white/10 text-gray-100 outline-none ring-teal-500/30 focus:ring-2 focus:border-teal-500/50 transition-all"
            aria-label="Select project filter"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setIsAddingTask(true);
            setEditingTask(null);
            setNewTask({
              title: '',
              description: '',
              priority: 'Medium',
              status: 'Todo',
              projectId: selectedProject !== 'all' ? selectedProject : '',
            });
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg"
        >
          <PlusCircle size={15} />
          <span>Add Task</span>
        </button>
      </div>

      {activeView === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="rounded-xl overflow-hidden">
              <div className="bg-white/8 backdrop-blur-lg p-3 rounded-t-xl border-t border-l border-r border-white/10">
                <h3 className="font-medium text-base text-gray-100">{status} ({statusTasks.length})</h3>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-3 rounded-b-xl border-b border-l border-r border-white/10 h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {statusTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No tasks in this status
                  </div>
                ) : (
                  <div className="space-y-3">
                    {statusTasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-white/8 backdrop-blur-lg border border-white/10 hover:border-teal-500/30 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-100 text-sm">{task.title}</h4>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleEditTask(task)}
                              className="p-1 rounded-full bg-white/10 hover:bg-teal-500/20 transition-all text-teal-300"
                              aria-label={`Edit task: ${task.title}`}
                            >
                              <Edit size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 rounded-full bg-white/10 hover:bg-red-500/20 transition-all text-red-400"
                              aria-label={`Delete task: ${task.title}`}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-300 mb-2.5 line-clamp-2">
                          {task.description || 'No description'}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === 'High' 
                              ? 'bg-red-500/10 text-red-300' 
                              : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-emerald-500/10 text-emerald-300'
                          }`}>
                            {task.priority}
                          </span>
                          
                          <div className="flex gap-1">
                            {status !== 'Todo' && (
                              <button 
                                onClick={() => updateTaskStatus(task.id, 'Todo')}
                                className="text-xs px-1.5 py-0.5 rounded-full bg-white/8 hover:bg-white/12"
                              >
                                Todo
                              </button>
                            )}
                            {status !== 'In Progress' && (
                              <button 
                                onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                className="text-xs px-1.5 py-0.5 rounded-full bg-white/8 hover:bg-white/12"
                              >
                                Progress
                              </button>
                            )}
                            {status !== 'Completed' && (
                              <button 
                                onClick={() => updateTaskStatus(task.id, 'Completed')}
                                className="text-xs px-1.5 py-0.5 rounded-full bg-white/8 hover:bg-white/12"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {projects.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/8 text-xs text-gray-400">
                            Project: {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'projects' && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 sm:p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-medium text-gray-100">Projects</h2>
            <button
              onClick={() => {
                setIsAddingProject(true);
                setNewProject({ name: '', description: '' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all"
            >
              <PlusCircle size={14} />
              <span>New Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No projects yet. Create your first project to start organizing tasks.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => {
                const projectTasks = tasks.filter(task => task.projectId === project.id);
                const taskStats = {
                  total: projectTasks.length,
                  completed: projectTasks.filter(t => t.status === 'Completed').length,
                  inProgress: projectTasks.filter(t => t.status === 'In Progress').length,
                  todo: projectTasks.filter(t => t.status === 'Todo').length,
                };
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/8 backdrop-blur-lg border border-white/10 hover:border-teal-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-base text-gray-100">{project.name}</h3>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 rounded-full bg-white/10 hover:bg-red-500/20 transition-all text-red-400"
                        aria-label={`Delete project: ${project.name}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                      {project.description || 'No description'}
                    </p>
                    
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-200">
                        {taskStats.total > 0 
                          ? Math.round((taskStats.completed / taskStats.total) * 100) 
                          : 0}%
                      </span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-white/8 rounded-full mb-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                        style={{ 
                          width: `${taskStats.total > 0 
                            ? Math.round((taskStats.completed / taskStats.total) * 100) 
                            : 0}%` 
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-1.5 bg-white/8 rounded text-center">
                        <div className="text-red-300">{taskStats.todo}</div>
                        <div className="text-gray-400">Todo</div>
                      </div>
                      <div className="p-1.5 bg-white/8 rounded text-center">
                        <div className="text-amber-300">{taskStats.inProgress}</div>
                        <div className="text-gray-400">In Progress</div>
                      </div>
                      <div className="p-1.5 bg-white/8 rounded text-center">
                        <div className="text-emerald-300">{taskStats.completed}</div>
                        <div className="text-gray-400">Completed</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedProject(project.id);
                        setActiveView('board');
                      }}
                      className="w-full mt-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 transition-all text-teal-300 hover:text-teal-200 text-xs"
                    >
                      View Tasks
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Project Modal */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-slate-900 border border-white/10 rounded-xl p-5 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-medium text-gray-100">New Project</h2>
              <button 
                onClick={() => setIsAddingProject(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/15 transition-all text-gray-400 hover:text-gray-300"
                aria-label="Close add project dialog"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
                  placeholder="Enter project name"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 min-h-[80px] resize-none"
                  placeholder="Enter project description"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-5 pt-1">
                <button
                  onClick={() => setIsAddingProject(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 transition-all text-sm text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all text-sm"
                >
                  Create Project
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-slate-900 border border-white/10 rounded-xl p-5 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-medium text-gray-100">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button 
                onClick={() => {
                  setIsAddingTask(false);
                  setEditingTask(null);
                }}
                className="p-1 rounded-full bg-white/10 hover:bg-white/15 transition-all text-gray-400 hover:text-gray-300"
                aria-label="Close add task dialog"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
                  placeholder="Enter task title"
                />
                {formErrors.title && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 min-h-[80px] resize-none"
                  placeholder="Enter task description"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                  Project
                </label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
                  aria-label="Select project for task"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {formErrors.projectId && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.projectId}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full p-2.5 rounded-lg bg-slate-800 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
                    aria-label="Select task priority"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1 ml-1">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Status })}
                    className="w-full p-2.5 rounded-lg bg-slate-800 border border-white/10 text-gray-100 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
                    aria-label="Select task status"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-5 pt-1">
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setEditingTask(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 transition-all text-sm text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateTask}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all text-sm"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
