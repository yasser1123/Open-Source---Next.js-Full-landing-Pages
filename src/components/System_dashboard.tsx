"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Types
interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  max: number
  status: "normal" | "warning" | "critical"
  history: number[]
}

interface LogEntry {
  id: string
  timestamp: string
  type: "info" | "warning" | "error" | "success"
  message: string
  source: string
}

interface EnvironmentControl {
  id: string
  name: string
  value: number
  unit: string
  min: number
  max: number
  status: "normal" | "warning" | "critical"
}

interface ResourceAllocation {
  id: string
  name: string
  used: number
  total: number
  priority: "low" | "medium" | "high"
}

// Sample data - in a real app, this would come from an API
const initialMetrics: SystemMetric[] = [
  {
    id: "cpu",
    name: "CPU Usage",
    value: 42,
    unit: "%",
    max: 100,
    status: "normal",
    history: [35, 38, 40, 37, 39, 42, 45, 42, 40, 38]
  },
  {
    id: "memory",
    name: "Memory Usage",
    value: 68,
    unit: "%",
    max: 100,
    status: "normal",
    history: [60, 62, 65, 67, 64, 66, 68, 67, 69, 68]
  },
  {
    id: "disk",
    name: "Disk I/O",
    value: 35,
    unit: "MB/s",
    max: 150,
    status: "normal",
    history: [25, 28, 32, 30, 33, 35, 32, 34, 36, 35]
  },
  {
    id: "network",
    name: "Network Traffic",
    value: 72,
    unit: "Mbps",
    max: 250,
    status: "normal",
    history: [65, 70, 68, 72, 75, 70, 73, 72, 70, 72]
  },
  {
    id: "gpu",
    name: "GPU Utilization",
    value: 58,
    unit: "%",
    max: 100,
    status: "normal",
    history: [50, 53, 55, 58, 56, 54, 57, 59, 56, 58]
  },
  {
    id: "temperature",
    name: "System Temperature",
    value: 62,
    unit: "°C",
    max: 90,
    status: "normal",
    history: [58, 60, 63, 65, 64, 62, 60, 61, 63, 62]
  }
]

const initialLogs: LogEntry[] = [
  {
    id: "log1",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    type: "success",
    message: "System startup completed successfully",
    source: "System"
  },
  {
    id: "log2",
    timestamp: new Date(Date.now() - 90000).toISOString(),
    type: "info",
    message: "Resource allocation optimized for current workload",
    source: "Resource Manager"
  },
  {
    id: "log3",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    type: "warning",
    message: "Network latency increased",
    source: "Network Monitor"
  },
  {
    id: "log4",
    timestamp: new Date(Date.now() - 30000).toISOString(),
    type: "error",
    message: "Failed to connect to remote data source",
    source: "Data Pipeline"
  },
  {
    id: "log5",
    timestamp: new Date(Date.now() - 15000).toISOString(),
    type: "info",
    message: "Scheduled system maintenance in 24 hours",
    source: "System Admin"
  }
]

const initialEnvironmentControls: EnvironmentControl[] = [
  {
    id: "cooling",
    name: "Cooling System",
    value: 68,
    unit: "%",
    min: 0,
    max: 100,
    status: "normal"
  },
  {
    id: "power",
    name: "Power Management",
    value: 85,
    unit: "%",
    min: 0,
    max: 100,
    status: "normal"
  },
  {
    id: "lighting",
    name: "Ambient Lighting",
    value: 40,
    unit: "%",
    min: 0,
    max: 100,
    status: "normal"
  }
]

const initialResourceAllocations: ResourceAllocation[] = [
  {
    id: "compute",
    name: "Compute Resources",
    used: 1420,
    total: 2000,
    priority: "high"
  },
  {
    id: "storage",
    name: "Storage Resources",
    used: 3200,
    total: 5000,
    priority: "medium"
  },
  {
    id: "bandwidth",
    name: "Network Bandwidth",
    used: 850,
    total: 1500,
    priority: "high"
  },
  {
    id: "memory_alloc",
    name: "Memory Allocation",
    used: 12800,
    total: 16000,
    priority: "medium"
  }
]

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Components
const MetricCard = ({ metric }: { metric: SystemMetric }) => {
  const percentage = (metric.value / metric.max) * 100
  
  let statusColor = "text-emerald-500"
  let bgColor = "bg-emerald-500"
  let statusText = "Normal"
  
  if (metric.status === "warning") {
    statusColor = "text-amber-500"
    bgColor = "bg-amber-500"
    statusText = "Warning"
  } else if (metric.status === "critical") {
    statusColor = "text-red-500"
    bgColor = "bg-red-500"
    statusText = "Critical"
  }
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-200 font-medium">{metric.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor} bg-opacity-20 ${bgColor.replace("bg", "bg")}`}>
            {statusText}
          </span>
        </div>
        
        <div className="flex items-end justify-between mb-2">
          <div className="text-2xl font-bold text-gray-100">{metric.value}<span className="text-sm ml-1 text-gray-400">{metric.unit}</span></div>
          <div className="text-xs text-gray-500">Max: {metric.max}{metric.unit}</div>
        </div>
        
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${bgColor}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="mt-3 h-12">
          <div className="flex items-end justify-between h-full">
            {metric.history.map((value, index) => {
              const historyPercentage = (value / metric.max) * 100
              return (
                <div 
                  key={index} 
                  className={`w-[8%] rounded-sm ${bgColor}`}
                  style={{ height: `${historyPercentage}%`, opacity: 0.3 + (index / metric.history.length) * 0.7 }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const SystemClock = () => {
  const [time, setTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    // This runs only on the client, after hydration
    setIsClient(true)
    setTime(new Date())
    
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    return () => {
      clearInterval(timer)
    }
  }, [])
  
  // Don't render anything time-related during SSR
  // Only show time-related elements when we're on the client
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 p-4">
      <div className="text-center">
        <h3 className="text-gray-400 font-medium mb-1">System Time</h3>
        {!isClient ? (
          <>
            <div className="text-3xl font-bold text-gray-100 mb-2">--:--:-- --</div>
            <div className="text-gray-500 text-sm">---</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {['UTC', 'PST', 'EST', 'GMT'].map((timezone) => (
                <div key={timezone} className="bg-gray-800 rounded-lg p-2">
                  <div className="text-xs text-gray-500">{timezone}</div>
                  <div className="text-sm text-gray-300 font-medium">--:--</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-gray-100 mb-2">
              {time?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-gray-500 text-sm">
              {time?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {['UTC', 'PST', 'EST', 'GMT'].map((timezone) => (
                <div key={timezone} className="bg-gray-800 rounded-lg p-2">
                  <div className="text-xs text-gray-500">{timezone}</div>
                  <div className="text-sm text-gray-300 font-medium">
                    {time?.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      timeZone: timezone === 'UTC' ? 'UTC' : 
                                timezone === 'PST' ? 'America/Los_Angeles' : 
                                timezone === 'EST' ? 'America/New_York' : 
                                'Europe/London'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const LogViewer = ({ logs }: { logs: LogEntry[] }) => {
  const logColors = {
    info: "border-blue-500 text-blue-400",
    warning: "border-amber-500 text-amber-400",
    error: "border-red-500 text-red-400",
    success: "border-emerald-500 text-emerald-400"
  }
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-200 font-medium">System Logs</h3>
        <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 px-2 py-1 rounded-md transition-colors">
          Clear All
        </button>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`border-l-2 pl-3 py-2 bg-gray-800 bg-opacity-50 rounded-r-md ${logColors[log.type]}`}
          >
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{log.source}</span>
              <span>{formatDate(log.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-300">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResourceAllocationCard = ({ resources }: { resources: ResourceAllocation[] }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 p-4">
      <h3 className="text-gray-200 font-medium mb-3">Resource Allocation</h3>
      
      <div className="space-y-4">
        {resources.map((resource) => {
          const percentage = (resource.used / resource.total) * 100
          
          let priorityColor = "bg-blue-500"
          if (resource.priority === "high") {
            priorityColor = "bg-indigo-500"
          } else if (resource.priority === "medium") {
            priorityColor = "bg-purple-500"
          }
          
          return (
            <div key={resource.id}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${priorityColor} mr-2`}></div>
                  <span className="text-sm text-gray-300">{resource.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatNumber(resource.used)} / {formatNumber(resource.total)}
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${priorityColor}`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EnvironmentControlCard = ({ controls }: { controls: EnvironmentControl[] }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 p-4">
      <h3 className="text-gray-200 font-medium mb-3">Environment Controls</h3>
      
      <div className="space-y-5">
        {controls.map((control) => {
          const percentage = ((control.value - control.min) / (control.max - control.min)) * 100
          
          let statusColor = "bg-emerald-500"
          if (control.status === "warning") {
            statusColor = "bg-amber-500"
          } else if (control.status === "critical") {
            statusColor = "bg-red-500"
          }
          
          return (
            <div key={control.id} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300">{control.name}</span>
                <span className="text-xs text-gray-400">{control.value}{control.unit}</span>
              </div>
              
              <input 
                type="range" 
                min={control.min} 
                max={control.max} 
                value={control.value}
                className="w-full h-2 rounded-full appearance-none bg-gray-800 cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, ${statusColor} 0%, ${statusColor} ${percentage}%, transparent ${percentage}%, transparent 100%)`
                }}
                onChange={() => {}} // In a real app, this would update the control value
                aria-label={`${control.name} control`}
              />
              
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{control.min}{control.unit}</span>
                <span className="text-xs text-gray-500">{control.max}{control.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function SystemDashboard() {
  // In a real app, we would fetch this data from an API
  // and use proper state management
  const [metrics, setMetrics] = useState<SystemMetric[]>(initialMetrics)
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [resources, setResources] = useState<ResourceAllocation[]>(initialResourceAllocations)
  const [controls, setControls] = useState<EnvironmentControl[]>(initialEnvironmentControls)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Update metrics with random fluctuations
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          const randomChange = Math.random() * 6 - 3 // Random value between -3 and 3
          const newValue = Math.max(0, Math.min(metric.value + randomChange, metric.max))
          
          // Determine new status based on value
          let newStatus: "normal" | "warning" | "critical" = "normal"
          const percentage = (newValue / metric.max) * 100
          
          if (percentage > 90) {
            newStatus = "critical"
          } else if (percentage > 75) {
            newStatus = "warning"
          }
          
          return {
            ...metric,
            value: Math.round(newValue * 10) / 10, // Round to 1 decimal place
            status: newStatus,
            history: [...metric.history.slice(1), Math.round(newValue * 10) / 10]
          }
        })
      )
      
      // Occasionally add a new log entry
      if (Math.random() < 0.3) { // 30% chance of a new log each interval
        const logTypes: ("info" | "warning" | "error" | "success")[] = ["info", "warning", "error", "success"]
        const randomType = logTypes[Math.floor(Math.random() * logTypes.length)]
        
        const sources = ["System", "Network Monitor", "Resource Manager", "Security", "Data Pipeline"]
        const randomSource = sources[Math.floor(Math.random() * sources.length)]
        
        const messages = {
          info: [
            "System optimization completed",
            "Backup snapshot created",
            "New update available",
            "User session started"
          ],
          warning: [
            "Disk space running low",
            "Network latency increased",
            "Memory usage approaching threshold",
            "Background process taking longer than expected"
          ],
          error: [
            "Failed to connect to remote service",
            "Database query timeout",
            "Authentication failure detected",
            "Resource allocation failed"
          ],
          success: [
            "System update completed successfully",
            "Data migration completed",
            "Configuration changes applied",
            "Resource optimization successful"
          ]
        }
        
        const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)]
        
        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: randomType,
          message: randomMessage,
          source: randomSource
        }
        
        setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]) // Keep only the 10 most recent logs
      }
      
      // Update resource allocations
      setResources(prevResources => 
        prevResources.map(resource => {
          const randomChange = Math.random() * 50 - 25 // Random value between -25 and 25
          const newUsed = Math.max(0, Math.min(resource.used + randomChange, resource.total))
          
          return {
            ...resource,
            used: Math.round(newUsed)
          }
        })
      )
      
      // Update environment controls
      setControls(prevControls => 
        prevControls.map(control => {
          const randomChange = Math.random() * 4 - 2 // Random value between -2 and 2
          const newValue = Math.max(control.min, Math.min(control.value + randomChange, control.max))
          
          // Determine new status based on value
          let newStatus: "normal" | "warning" | "critical" = "normal"
          const percentage = ((newValue - control.min) / (control.max - control.min)) * 100
          
          if (percentage > 90 || percentage < 10) {
            newStatus = "warning"
          }
          
          return {
            ...control,
            value: Math.round(newValue),
            status: newStatus
          }
        })
      )
    }, 2000) // Update every 2 seconds
    
    return () => {
      clearInterval(updateInterval)
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-6">
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">System Dashboard</h1>
              <p className="text-gray-500">Real-time monitoring and control interface</p>
            </div>
            {/* <div className="flex space-x-3">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </div>
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </div>
              </button>
            </div> */}
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400">System Status</div>
              <div className="text-[0.700rem]  font-medium text-emerald-400 flex items-center justify-center">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>
                Operational
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400">Active Users</div>
              <div className="text-sm font-medium text-gray-200">247</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400">Error Rate</div>
              <div className="text-sm font-medium text-gray-200">0.05%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400">Uptime</div>
              <div className="text-sm font-medium text-gray-200">99.98%</div>
            </div>
          </div>
        </motion.div>
      </header>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {metrics.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
          
          <LogViewer logs={logs} />
        </div>
        
        <div className="space-y-6">
          <SystemClock />
          <ResourceAllocationCard resources={resources} />
          <EnvironmentControlCard controls={controls} />
        </div>
      </motion.div>
      
      <div className="mt-8 border-t border-gray-800 pt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Dashboard v1.0.2 | Last updated: {isClient ? new Date().toLocaleString() : '---'}
          </div>
          <div className="text-sm text-gray-500">
            Secure connection | End-to-end encryption
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
