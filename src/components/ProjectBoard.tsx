'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Define types
type Priority = 'low' | 'medium' | 'high';
type Status = 'todo' | 'inProgress' | 'review' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  assignee?: string;
  status: Status;
  tags: string[];
}

interface Note {
  id: string;
  content: string;
  color: string;
  status: Status;
}

interface Column {
  id: Status;
  title: string;
  taskIds: string[];
  noteIds: string[];
}

interface BoardData {
  tasks: { [key: string]: Task };
  notes: { [key: string]: Note };
  columns: { [key: string]: Column };
  columnOrder: Status[];
}

// Generate sample data
const initialData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Create project plan',
      description: 'Define scope, timeline, and resources needed',
      priority: 'high',
      dueDate: '2023-07-15',
      assignee: 'Alex',
      status: 'todo',
      tags: ['planning', 'documentation']
    },
    'task-2': {
      id: 'task-2',
      title: 'Design UI mockups',
      description: 'Create wireframes and design mockups for key screens',
      priority: 'medium',
      dueDate: '2023-07-20',
      assignee: 'Taylor',
      status: 'inProgress',
      tags: ['design', 'ui']
    },
    'task-3': {
      id: 'task-3',
      title: 'Setup development environment',
      description: 'Configure tools, frameworks, and databases',
      priority: 'high',
      dueDate: '2023-07-10',
      assignee: 'Jordan',
      status: 'review',
      tags: ['setup', 'development']
    },
    'task-4': {
      id: 'task-4',
      title: 'Create initial documentation',
      description: 'Document project architecture and setup instructions',
      priority: 'low',
      dueDate: '2023-07-25',
      assignee: 'Casey',
      status: 'done',
      tags: ['documentation']
    },
  },
  notes: {
    'note-1': {
      id: 'note-1',
      content: 'Team meeting scheduled for Friday at 2pm',
      color: 'yellow',
      status: 'todo'
    },
    'note-2': {
      id: 'note-2',
      content: 'Remember to update the API docs after changes',
      color: 'blue',
      status: 'inProgress'
    },
    'note-3': {
      id: 'note-3',
      content: 'Client feedback: Focus on performance improvements',
      color: 'green',
      status: 'review'
    },
    'note-4': {
      id: 'note-4',
      content: 'Project deadline extended to end of month',
      color: 'pink',
      status: 'done'
    },
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1'],
      noteIds: ['note-1']
    },
    'inProgress': {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: ['task-2'],
      noteIds: ['note-2']
    },
    'review': {
      id: 'review',
      title: 'Review',
      taskIds: ['task-3'],
      noteIds: ['note-3']
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: ['task-4'],
      noteIds: ['note-4']
    },
  },
  columnOrder: ['todo', 'inProgress', 'review', 'done'],
};

// Priority colors
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

// Note colors
const noteColors = {
  yellow: 'bg-yellow-100 border-yellow-300',
  blue: 'bg-blue-100 border-blue-300',
  green: 'bg-green-100 border-green-300',
  pink: 'bg-pink-100 border-pink-300',
  purple: 'bg-purple-100 border-purple-300',
};

const ProjectBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<Status>('todo');
  const [newNoteColumn, setNewNoteColumn] = useState<Status>('todo');
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'status'>>({
    title: '',
    description: '',
    priority: 'medium',
    tags: []
  });
  const [newNote, setNewNote] = useState({
    content: '',
    color: 'yellow'
  });

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // If there's no destination or if item was dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Handle different types of draggables
    if (type === 'task') {
      // Create a copy of the board data
      const newData = { ...boardData };
      
      // Remove from source column
      const sourceColumn = newData.columns[source.droppableId];
      sourceColumn.taskIds.splice(source.index, 1);
      
      // Add to destination column
      const destColumn = newData.columns[destination.droppableId];
      destColumn.taskIds.splice(destination.index, 0, draggableId);
      
      // Update task status
      newData.tasks[draggableId].status = destination.droppableId as Status;
      
      // Update state
      setBoardData(newData);
    } else if (type === 'note') {
      // Create a copy of the board data
      const newData = { ...boardData };
      
      // Remove from source column
      const sourceColumn = newData.columns[source.droppableId];
      sourceColumn.noteIds.splice(source.index, 1);
      
      // Add to destination column
      const destColumn = newData.columns[destination.droppableId];
      destColumn.noteIds.splice(destination.index, 0, draggableId);
      
      // Update note status
      newData.notes[draggableId].status = destination.droppableId as Status;
      
      // Update state
      setBoardData(newData);
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const newTaskId = `task-${Date.now()}`;
    const task: Task = {
      id: newTaskId,
      status: newTaskColumn,
      ...newTask,
    };

    const newData = { ...boardData };
    newData.tasks[newTaskId] = task;
    newData.columns[newTaskColumn].taskIds.push(newTaskId);

    setBoardData(newData);
    setNewTask({ title: '', description: '', priority: 'medium', tags: [] });
    setIsAddingTask(false);
  };

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.content.trim()) return;

    const newNoteId = `note-${Date.now()}`;
    const note: Note = {
      id: newNoteId,
      status: newNoteColumn,
      ...newNote,
    };

    const newData = { ...boardData };
    newData.notes[newNoteId] = note;
    newData.columns[newNoteColumn].noteIds.push(newNoteId);

    setBoardData(newData);
    setNewNote({ content: '', color: 'yellow' });
    setIsAddingNote(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Board</h1>
          <div className="flex mt-4 space-x-4">
            <button 
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </button>
            <button 
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Add Note
            </button>
          </div>
        </header>

        {/* Task Form Modal */}
        {isAddingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-title">Title</label>
                  <input
                    id="task-title"
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-description">Description</label>
                  <textarea
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    title="Priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as Priority})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-due-date">Due Date</label>
                  <input
                    id="task-due-date"
                    type="date"
                    title="Due Date"
                    placeholder="Select a due date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-assignee">Assignee</label>
                  <input
                    id="task-assignee"
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Assign to"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-tags">Tags (comma separated)</label>
                  <input
                    id="task-tags"
                    type="text"
                    value={newTask.tags.join(', ')}
                    onChange={(e) => setNewTask({...newTask, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. urgent, design, bug"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-column">Column</label>
                  <select
                    id="task-column"
                    title="Column"
                    value={newTaskColumn}
                    onChange={(e) => setNewTaskColumn(e.target.value as Status)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {boardData.columnOrder.map(columnId => (
                      <option key={columnId} value={columnId}>
                        {boardData.columns[columnId].title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Note Form Modal */}
        {isAddingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="note-content">Content</label>
                  <textarea
                    id="note-content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter note content"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex space-x-2">
                    {Object.keys(noteColors).map(color => (
                      <button
                        key={color}
                        title={`${color} color`}
                        aria-label={`Select ${color} color`}
                        onClick={() => setNewNote({...newNote, color})}
                        className={`w-8 h-8 rounded-full ${noteColors[color as keyof typeof noteColors]} ${newNote.color === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="note-column">Column</label>
                  <select
                    id="note-column"
                    title="Column"
                    value={newNoteColumn}
                    onChange={(e) => setNewNoteColumn(e.target.value as Status)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {boardData.columnOrder.map(columnId => (
                      <option key={columnId} value={columnId}>
                        {boardData.columns[columnId].title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardData.columnOrder.map(columnId => {
              const column = boardData.columns[columnId];
              const tasks = column.taskIds.map(taskId => boardData.tasks[taskId]);
              const notes = column.noteIds.map(noteId => boardData.notes[noteId]);

              return (
                <div key={column.id} className="bg-white rounded-lg shadow-md">
                  <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="font-semibold text-gray-700">
                      {column.title} ({tasks.length + notes.length})
                    </h3>
                  </div>
                  <Droppable droppableId={column.id} type="task">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 min-h-[100px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Due: {task.dueDate}
                                  </div>
                                )}
                                {task.assignee && (
                                  <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {task.assignee}
                                  </div>
                                )}
                                {task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {task.tags.map((tag, i) => (
                                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId={column.id} type="note">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 border-t border-gray-100 ${snapshot.isDraggingOver ? 'bg-purple-50' : ''}`}
                      >
                        {notes.map((note, index) => (
                          <Draggable key={note.id} draggableId={note.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${noteColors[note.color as keyof typeof noteColors]} p-3 mb-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg transform scale-105' : ''}`}
                              >
                                <p className="text-sm text-gray-700">{note.content}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProjectBoard; 