"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Types
interface Project {
  id: string
  name: string
  description: string
  progress: number
  team: string[]
  tasks: Task[]
  deadline: string
  status: 'active' | 'completed' | 'onHold'
}

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: string
  status: 'todo' | 'inProgress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  tasksCompleted: number
  currentTasks: number
}

// Components
const Header = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (query: string) => void }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
          Team Collaboration Hub
        </h1>
        <p className="text-gray-300 mt-1">Streamline your team workflow</p>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3 items-start sm:items-center">
        <div className="relative w-full sm:w-auto">
          <input 
            type="text"
            placeholder="Search projects or tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 text-sm rounded-lg py-2 px-4 pr-10 w-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            aria-label="Search projects or tasks"
          />
          <svg 
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

const DashboardStats = ({ projects, tasks, teamMembers }: { projects: Project[], tasks: Task[], teamMembers: TeamMember[] }) => {
  // Calculate upcoming deadlines (tasks due in next 7 days)
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  
  const upcomingDeadlines = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= sevenDaysFromNow && task.status !== 'completed';
  }).length;
  
  // Count active projects
  const activeProjects = projects.filter(project => project.status === 'active').length;
  
  // Count ongoing tasks
  const ongoingTasks = tasks.filter(task => task.status !== 'completed').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: "Active Projects", value: activeProjects.toString(), icon: "📊", color: "from-blue-400 to-indigo-500" },
        { label: "Ongoing Tasks", value: ongoingTasks.toString(), icon: "✓", color: "from-teal-400 to-emerald-500" },
        { label: "Team Members", value: teamMembers.length.toString(), icon: "👥", color: "from-purple-400 to-violet-500" },
        { label: "Upcoming Deadlines", value: upcomingDeadlines.toString(), icon: "🕙", color: "from-pink-400 to-rose-500" },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`glass-card bg-gradient-to-br ${stat.color} bg-opacity-20 p-4 rounded-xl`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-200 text-sm">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const _ProjectCard = ({ project }: { project: Project }) => {
  // Calculate days remaining
  const deadline = new Date(project.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <motion.div 
      className="glass-card rounded-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${
            project.status === 'active' ? 'bg-green-400/30 text-green-200' :
            project.status === 'completed' ? 'bg-blue-400/30 text-blue-200' :
            'bg-yellow-400/30 text-yellow-200'
          }`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-300 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((memberId, idx) => {
              const member = sampleTeamMembers.find(m => m.id === memberId);
              return (
                <div key={idx} className="w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden">
                  {member && (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
            {project.team.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs text-white">
                +{project.team.length - 3}
              </div>
            )}
          </div>
          
          <div className="text-xs flex items-center">
            <svg className="w-4 h-4 mr-1 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={daysRemaining < 5 ? 'text-red-300' : 'text-gray-300'}>
              {daysRemaining <= 0 
                ? 'Overdue' 
                : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{project.tasks.length} Tasks</span>
            <div className="flex space-x-2">
              <span>{project.tasks.filter(t => t.status === 'completed').length} Completed</span>
              <span>•</span>
              <span>{project.tasks.filter(t => t.status !== 'completed').length} Remaining</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const _TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Recent Tasks</h3>
        <button className="text-purple-300 hover:text-purple-200 text-sm flex items-center">
          View All
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.slice(0, 5).map((task) => {
          const assignee = sampleTeamMembers.find(m => m.id === task.assignee);
          return (
            <div key={task.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
              <input 
                type="checkbox" 
                id={`unused-check-${task.id}`}
                checked={task.status === 'completed'} 
                onChange={() => {}} 
                className="w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500"
                aria-label={`Check task ${task.title}`}
              />
              
              <div className="flex-1">
                <h4 className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{task.description}</p>
              </div>
              
              <div className="flex items-center">
                {assignee && (
                  <div className="flex items-center mr-4">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <img 
                        src={assignee.avatar} 
                        alt={assignee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-300">{assignee.name.split(' ')[0]}</span>
                  </div>
                )}
                
                <div className={`px-2 py-1 rounded-full text-xs ${
                  task.priority === 'high' ? 'bg-red-400/20 text-red-300' :
                  task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                  'bg-blue-400/20 text-blue-300'
                }`}>
                  {task.priority}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TeamSection = ({ team, onViewAllClick }: { team: TeamMember[], onViewAllClick: () => void }) => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Team Members</h3>
        <button 
          className="text-purple-300 hover:text-purple-200 text-sm"
          onClick={onViewAllClick}
          aria-label="View all team members"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {team.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-gray-900 ${
                  member.status === 'online' ? 'bg-green-400' :
                  member.status === 'busy' ? 'bg-yellow-400' :
                  'bg-gray-400'
                }`}></div>
              </div>
              
              <div>
                <h4 className="font-medium text-white">{member.name}</h4>
                <p className="text-xs text-gray-400">{member.role}</p>
              </div>
            </div>
            
            <div className="text-right text-xs">
              <p className="text-green-300">{member.tasksCompleted} completed</p>
              <p className="text-gray-400">{member.currentTasks} in progress</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const NewProjectModal = ({ show, onClose, onSave }: { 
  show: boolean, 
  onClose: () => void, 
  onSave: (project: Omit<Project, 'id' | 'tasks'>) => void 
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])

  const handleSave = () => {
    if (!name || !description || !deadline) return;
    
    onSave({
      name,
      description,
      deadline,
      team: selectedTeam,
      progress: 0,
      status: 'active'
    });
    
    // Reset form
    setName('');
    setDescription('');
    setDeadline('');
    setSelectedTeam([]);
    onClose();
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass-card rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Create New Project</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 h-24"
              placeholder="Enter project description"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="project-deadline">Deadline</label>
            <input
              id="project-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Set project deadline"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">Team Members</label>
            <div className="flex flex-wrap gap-2">
              {sampleTeamMembers.map(member => (
                <div 
                  key={member.id}
                  onClick={() => {
                    if (selectedTeam.includes(member.id)) {
                      setSelectedTeam(selectedTeam.filter(id => id !== member.id));
                    } else {
                      setSelectedTeam([...selectedTeam, member.id]);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                    selectedTeam.includes(member.id) 
                      ? 'bg-purple-500/50 border border-purple-300/50' 
                      : 'bg-white/10 border border-white/20'
                  }`}
                  role="checkbox"
                  aria-checked={selectedTeam.includes(member.id) ? "true" : "false"}
                  aria-label={`Select ${member.name} for project team`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (selectedTeam.includes(member.id)) {
                        setSelectedTeam(selectedTeam.filter(id => id !== member.id));
                      } else {
                        setSelectedTeam([...selectedTeam, member.id]);
                      }
                      e.preventDefault();
                    }
                  }}
                >
                  <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-white mr-3 hover:bg-white/10"
              aria-label="Cancel creating project"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              disabled={!name || !description || !deadline}
              aria-label="Create new project"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fix the TaskModal component
const TaskModal = ({ 
  show, 
  onClose, 
  onSave, 
  onDelete,
  projectId, 
  editTask = null 
}: { 
  show: boolean, 
  onClose: () => void, 
  onSave: (task: Omit<Task, 'id'>, projectId: string) => void,
  onDelete?: (taskId: string, projectId: string) => void,
  projectId: string,
  editTask?: Task | null
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [status, setStatus] = useState<Task['status']>('todo')

  // Initialize form with existing task data if in edit mode
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description)
      setAssignee(editTask.assignee)
      setDueDate(editTask.dueDate)
      setPriority(editTask.priority)
      setStatus(editTask.status)
    } else {
      // Reset form for new task
      setTitle('')
      setDescription('')
      setAssignee('')
      setDueDate('')
      setPriority('medium')
      setStatus('todo')
    }
  }, [editTask, show])

  const handleSave = () => {
    if (!title || !description || !assignee || !dueDate) return;
    
    onSave({
      title,
      description,
      assignee,
      dueDate,
      priority,
      status
    }, projectId);
    
    onClose();
  }

  const handleDelete = () => {
    if (editTask && onDelete) {
      onDelete(editTask.id, projectId);
      onClose();
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass-card rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 h-20"
              placeholder="Enter task description"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1" htmlFor="task-assignee">Assignee</label>
              <select
                id="task-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Select assignee"
              >
                <option value="">Select team member</option>
                {sampleTeamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1" htmlFor="task-duedate">Due Date</label>
              <input
                id="task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Set due date"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <fieldset>
                <legend className="block text-gray-300 text-sm mb-1">Priority</legend>
                <div className="flex space-x-2">
                  {(['low', 'medium', 'high'] as Task['priority'][]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        priority === p 
                          ? p === 'high' 
                            ? 'bg-red-500/30 border border-red-400/50 text-red-100' 
                            : p === 'medium'
                              ? 'bg-yellow-500/30 border border-yellow-400/50 text-yellow-100'
                              : 'bg-blue-500/30 border border-blue-400/50 text-blue-100'
                          : 'bg-white/10 border border-white/20 text-gray-300'
                      }`}
                      aria-label={`Set priority to ${p}`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Set task status"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            {editTask && (
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20"
                aria-label="Delete task"
              >
                Delete Task
              </button>
            )}
            <div className={editTask ? "flex ml-auto" : "flex justify-end w-full"}>
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-white mr-3 hover:bg-white/10"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                disabled={!title || !description || !assignee || !dueDate}
                aria-label={editTask ? "Update task" : "Create task"}
              >
                {editTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fix the AllTasksModal styling issues
const AllTasksModal = ({ 
  show, 
  onClose, 
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange
}: { 
  show: boolean, 
  onClose: () => void,
  tasks: Task[],
  onEditTask: (task: Task, projectId: string) => void,
  onDeleteTask: (taskId: string, projectId: string) => void,
  onStatusChange: (taskId: string, projectId: string, newStatus: Task['status']) => void
}) => {
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'status'>('priority')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Find project by task
  const getProjectIdByTask = (taskId: string): string => {
    const project = sampleProjects.find(p => p.tasks.some(t => t.id === taskId));
    return project ? project.id : "";
  };
  
  // Sort and filter tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      const statusOrder = { todo: 0, inProgress: 1, review: 2, completed: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
  });
  
  const filteredTasks = filterStatus === 'all' 
    ? sortedTasks 
    : sortedTasks.filter(task => task.status === filterStatus);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass-card rounded-xl w-full max-w-5xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">All Tasks</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <select 
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'dueDate' | 'status')}
              aria-label="Sort tasks by"
              style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <option value="priority" className="bg-gray-800 text-white">Sort by Priority</option>
              <option value="dueDate" className="bg-gray-800 text-white">Sort by Due Date</option>
              <option value="status" className="bg-gray-800 text-white">Sort by Status</option>
            </select>
            
            <select 
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter tasks by status"
              style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <option value="all" className="bg-gray-800 text-white">All Statuses</option>
              <option value="todo" className="bg-gray-800 text-white">To Do</option>
              <option value="inProgress" className="bg-gray-800 text-white">In Progress</option>
              <option value="review" className="bg-gray-800 text-white">Review</option>
              <option value="completed" className="bg-gray-800 text-white">Completed</option>
            </select>
          </div>
          
          <div className="text-xs text-gray-400 whitespace-nowrap">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const assignee = sampleTeamMembers.find(m => m.id === task.assignee);
              const projectId = getProjectIdByTask(task.id);
              const project = sampleProjects.find(p => p.id === projectId);
              
              return (
                <div key={task.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center min-w-0">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'completed'} 
                        onChange={() => {
                          const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                          onStatusChange(task.id, projectId, newStatus);
                        }} 
                        className="w-5 h-5 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500 mr-3"
                        aria-label={`Mark task "${task.title}" as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
                        id={`task-check-${task.id}`}
                      />
                      
                      <div className="min-w-0">
                        <h4 className={`font-medium text-lg truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1 truncate">{project?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-shrink-0 space-x-2 ml-2">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[60px] ${
                        task.priority === 'high' ? 'bg-red-400/20 text-red-300' :
                        task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                        'bg-blue-400/20 text-blue-300'
                      }`}>
                        {task.priority}
                      </div>
                      
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[80px] ${
                        task.status === 'completed' ? 'bg-green-400/20 text-green-300' :
                        task.status === 'inProgress' ? 'bg-purple-400/20 text-purple-300' :
                        task.status === 'review' ? 'bg-blue-400/20 text-blue-300' :
                        'bg-gray-400/20 text-gray-300'
                      }`}>
                        {task.status === 'inProgress' ? 'In Progress' : 
                          task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{task.description}</p>
                  
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    {assignee && (
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <img 
                            src={assignee.avatar} 
                            alt={assignee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-300 truncate max-w-[120px]">{assignee.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center ml-auto">
                      <div className="text-xs text-gray-400 mr-4 whitespace-nowrap">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      
                      <button 
                        onClick={() => onEditTask(task, projectId)}
                        className="text-gray-400 hover:text-white mr-2"
                        aria-label="Edit task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => onDeleteTask(task.id, projectId)}
                        className="text-gray-400 hover:text-red-400"
                        aria-label="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add TeamMembersModal component
const TeamMembersModal = ({ 
  show, 
  onClose, 
  teamMembers 
}: { 
  show: boolean, 
  onClose: () => void,
  teamMembers: TeamMember[]
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass-card rounded-xl w-full max-w-3xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Team Members</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="glass-card p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                      member.status === 'online' ? 'bg-green-400' :
                      member.status === 'busy' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white text-lg">{member.name}</h4>
                    <p className="text-gray-300">{member.role}</p>
                    
                    <div className="mt-2 flex space-x-4">
                      <div className="text-xs">
                        <span className="text-green-300">{member.tasksCompleted}</span>
                        <span className="text-gray-400"> completed</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-blue-300">{member.currentTasks}</span>
                        <span className="text-gray-400"> in progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Update the main dashboard component
export default function TeamCollabDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showAllTasksModal, setShowAllTasksModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [currentProjectId, setCurrentProjectId] = useState<string>("")
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [allTasks, setAllTasks] = useState<Task[]>([])

  // Initialize data
  useEffect(() => {
    // Initialize with sample data
    setProjects(sampleProjects)
    setTeam(sampleTeamMembers)
    
    // Collect all tasks from all projects
    const tasks = sampleProjects.flatMap(project => project.tasks);
    // Sort tasks by priority by default (high first)
    const sortedTasks = sortTasksByPriority(tasks);
    setAllTasks(sortedTasks);
  }, [])

  // Helper function to sort tasks by priority
  const sortTasksByPriority = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Update the search functionality
  const filteredTasks = searchQuery
    ? allTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTasks;

  const handleAddProject = (projectData: Omit<Project, 'id' | 'tasks'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${projects.length + 1}`,
      tasks: []
    };
    
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>, projectId: string) => {
    // Create a copy of projects to work with
    let updatedProjects: Project[] = [];
    
    // Update the projects state
    setProjects(prevProjects => {
      updatedProjects = prevProjects.map(project => {
        if (project.id !== projectId) return project;
        
        // If we're editing an existing task
        if (editTask) {
          const updatedTasks = project.tasks.map(task => 
            task.id === editTask.id ? { ...taskData, id: task.id } : task
          );
          return { ...project, tasks: updatedTasks };
        }
        
        // If we're adding a new task
        const newTask: Task = {
          ...taskData,
          id: `t${Date.now()}`
        };
        
        return {
          ...project,
          tasks: [...project.tasks, newTask]
        };
      });
      
      return updatedProjects;
    });
    
    // Reset the edit task
    setEditTask(null);
    
    // Update allTasks with sorted tasks (after the state update)
    setTimeout(() => {
      const allNewTasks = updatedProjects.flatMap(project => project.tasks);
      const sortedTasks = sortTasksByPriority(allNewTasks);
      setAllTasks(sortedTasks);
    }, 0);
  };

  const handleDeleteTask = (taskId: string, projectId: string) => {
    // Create a copy of projects to work with
    let updatedProjects: Project[] = [];
    
    // Update the projects state
    setProjects(prevProjects => {
      updatedProjects = prevProjects.map(project => {
        if (project.id !== projectId) return project;
        
        // Filter out the deleted task
        const updatedTasks = project.tasks.filter(task => task.id !== taskId);
        return { ...project, tasks: updatedTasks };
      });
      
      return updatedProjects;
    });
    
    // Update allTasks after the state update
    setTimeout(() => {
      const allNewTasks = updatedProjects.flatMap(project => project.tasks);
      const sortedTasks = sortTasksByPriority(allNewTasks);
      setAllTasks(sortedTasks);
    }, 0);
  };

  const openTaskModal = (projectId: string, task: Task | null = null) => {
    setCurrentProjectId(projectId);
    setEditTask(task);
    setShowTaskModal(true);
  };

  const handleTaskStatusChange = (taskId: string, projectId: string, newStatus: Task['status']) => {
    // Create a copy of projects to work with
    let updatedProjects: Project[] = [];
    
    // Update the projects state
    setProjects(prevProjects => {
      updatedProjects = prevProjects.map(project => {
        if (project.id !== projectId) return project;
        
        const updatedTasks = project.tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        
        return { ...project, tasks: updatedTasks };
      });
      
      return updatedProjects;
    });
    
    // Update allTasks after the state update
    setTimeout(() => {
      const allNewTasks = updatedProjects.flatMap(project => project.tasks);
      const sortedTasks = sortTasksByPriority(allNewTasks);
      setAllTasks(sortedTasks);
    }, 0);
  };

  // Project card component
  const ProjectCard = ({ project }: { project: Project }) => {
    // Calculate days remaining
    const deadline = new Date(project.deadline);
    const today = new Date();
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <motion.div 
        className="glass-card rounded-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              project.status === 'active' ? 'bg-green-400/30 text-green-200' :
              project.status === 'completed' ? 'bg-blue-400/30 text-blue-200' :
              'bg-yellow-400/30 text-yellow-200'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((memberId, idx) => {
                const member = team.find(m => m.id === memberId);
                return (
                  <div key={idx} className="w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden">
                    {member && (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
              {project.team.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs text-white">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
            
            <div className="text-xs flex items-center">
              <svg className="w-4 h-4 mr-1 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={daysRemaining < 5 ? 'text-red-300' : 'text-gray-300'}>
                {daysRemaining <= 0 
                  ? 'Overdue' 
                  : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{project.tasks.length} Tasks</span>
              <div className="flex space-x-2">
                <span>{project.tasks.filter(t => t.status === 'completed').length} Completed</span>
                <span>•</span>
                <span>{project.tasks.filter(t => t.status !== 'completed').length} Remaining</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Task list component
  const TaskList = ({ tasks }: { tasks: Task[] }) => {
    // Find project by task
    const getProjectIdByTask = (taskId: string): string => {
      const project = projects.find(p => p.tasks.some(t => t.id === taskId));
      return project ? project.id : "";
    };

    return (
      <div className="glass-card rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Recent Tasks</h3>
          <button 
            className="text-purple-300 hover:text-purple-200 text-sm flex items-center"
            onClick={() => setShowAllTasksModal(true)}
            aria-label="View all tasks"
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          {/* Always show tasks sorted by priority */}
          {tasks.slice(0, 5).map((task) => {
            const assignee = team.find(m => m.id === task.assignee);
            const projectId = getProjectIdByTask(task.id);
            
            return (
              <div key={task.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id={`task-check-${task.id}`}
                    checked={task.status === 'completed'} 
                    onChange={() => {
                      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                      handleTaskStatusChange(task.id, projectId, newStatus);
                    }} 
                    className="w-5 h-5 mt-1 rounded-full border-2 border-purple-400 text-purple-600 focus:ring-purple-500"
                    aria-label={`Mark task "${task.title}" as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
                  />
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <label 
                      htmlFor={`task-check-${task.id}`} 
                      className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'} cursor-pointer truncate block`}
                    >
                      {task.title}
                    </label>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
                  {assignee && (
                    <div className="flex items-center mr-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden mr-1">
                        <img 
                          src={assignee.avatar} 
                          alt={assignee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-300 truncate max-w-[60px]">{assignee.name.split(' ')[0]}</span>
                    </div>
                  )}
                  
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'high' ? 'bg-red-400/20 text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                    'bg-blue-400/20 text-blue-300'
                  }`}>
                    {task.priority}
                  </div>

                  <div className="flex ml-auto mt-1 sm:mt-0">
                    <button 
                      onClick={() => openTaskModal(projectId, task)}
                      className="text-gray-400 hover:text-white mr-2"
                      aria-label="Edit task"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteTask(task.id, projectId)}
                      className="text-gray-400 hover:text-red-400"
                      aria-label="Delete task"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          
          {tasks.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No tasks found. Add a new task to get started.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <DashboardStats projects={projects} tasks={allTasks} teamMembers={team} />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Active Projects</h2>
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center"
            aria-label="Create new project"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskList tasks={filteredTasks} />
          </div>
          <div>
            <TeamSection 
              team={team} 
              onViewAllClick={() => setShowTeamModal(true)}
            />
          </div>
        </div>
      </div>
      
      <NewProjectModal 
        show={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)} 
        onSave={handleAddProject} 
      />
      
      <TaskModal
        show={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        projectId={currentProjectId}
        editTask={editTask}
      />
      
      <AllTasksModal
        show={showAllTasksModal}
        onClose={() => setShowAllTasksModal(false)}
        tasks={allTasks}
        onEditTask={(task, projectId) => {
          openTaskModal(projectId, task);
          setShowAllTasksModal(false);
        }}
        onDeleteTask={handleDeleteTask}
        onStatusChange={handleTaskStatusChange}
      />
      
      <TeamMembersModal
        show={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        teamMembers={team}
      />
      
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}

// Sample data for development
const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Revamp the company website with modern UI/UX principles",
    progress: 65,
    team: ["m1", "m2", "m4"],
    tasks: [
      {
        id: "t1",
        title: "Design Homepage Mockup",
        description: "Create wireframes and mockups for the new homepage",
        assignee: "m1",
        dueDate: "2023-06-30",
        status: "completed",
        priority: "high"
      },
      {
        id: "t2",
        title: "Develop Frontend Components",
        description: "Implement the UI components using React",
        assignee: "m2",
        dueDate: "2023-07-15",
        status: "inProgress",
        priority: "high"
      },
      {
        id: "t3",
        title: "Backend Integration",
        description: "Connect the frontend to the API endpoints",
        assignee: "m4",
        dueDate: "2023-07-30",
        status: "todo",
        priority: "medium"
      }
    ],
    deadline: "2023-08-15",
    status: "active"
  },
  {
    id: "p2",
    name: "Mobile App Development",
    description: "Create a cross-platform mobile app for our customers",
    progress: 30,
    team: ["m3", "m5", "m2"],
    tasks: [
      {
        id: "t4",
        title: "Finalize App Requirements",
        description: "Document all features and requirements for the app",
        assignee: "m3",
        dueDate: "2023-06-15",
        status: "completed",
        priority: "high"
      },
      {
        id: "t5",
        title: "UI Design for App",
        description: "Design all screens and user flows",
        assignee: "m5",
        dueDate: "2023-07-10",
        status: "inProgress",
        priority: "high"
      },
      {
        id: "t6",
        title: "Initial Development Setup",
        description: "Set up the development environment and project structure",
        assignee: "m2",
        dueDate: "2023-06-30",
        status: "completed",
        priority: "medium"
      }
    ],
    deadline: "2023-09-30",
    status: "active"
  },
  {
    id: "p3",
    name: "Marketing Campaign",
    description: "Q3 digital marketing campaign for new product launch",
    progress: 15,
    team: ["m1", "m5"],
    tasks: [
      {
        id: "t7",
        title: "Campaign Strategy",
        description: "Define the strategy and goals for the campaign",
        assignee: "m1",
        dueDate: "2023-07-05",
        status: "inProgress",
        priority: "high"
      },
      {
        id: "t8",
        title: "Content Creation",
        description: "Create copy and visual content for the campaign",
        assignee: "m5",
        dueDate: "2023-07-20",
        status: "todo",
        priority: "medium"
      }
    ],
    deadline: "2023-08-01",
    status: "active"
  }
];

const sampleTeamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Alex Johnson",
    role: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "online",
    tasksCompleted: 12,
    currentTasks: 3
  },
  {
    id: "m2",
    name: "Sam Wilson",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "busy",
    tasksCompleted: 18,
    currentTasks: 4
  },
  {
    id: "m3",
    name: "Taylor Smith",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    status: "online",
    tasksCompleted: 8,
    currentTasks: 2
  },
  {
    id: "m4",
    name: "Jamie Hayes",
    role: "Backend Developer",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    status: "offline",
    tasksCompleted: 15,
    currentTasks: 1
  },
  {
    id: "m5",
    name: "Morgan Lee",
    role: "Graphic Designer",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    status: "online",
    tasksCompleted: 10,
    currentTasks: 3
  }
];
