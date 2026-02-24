import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from './api';
import { useState } from 'react';
import type { Task } from './types';

function App() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  // 1. Fetch Tasks automatically
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // 2. Setup Mutations (Create, Update, Delete)
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Helper to filter tasks by status
  const getTasksByStatus = (status: Task['status']) => 
    tasks?.filter((t) => t.status === status) || [];

  if (isLoading) return <div className="p-10 text-white">Loading tasks...</div>;
  if (isError) return <div className="p-10 text-red-500">Error fetching data. Is backend running?</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Task Board
        </h1>

        {/* Input Form */}
        <div className="mb-10 flex gap-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full max-w-md focus:outline-none focus:border-blue-500 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && title) {
                createMutation.mutate({ title, description: '' });
                setTitle('');
              }
            }}
          />
          <button 
            onClick={() => {
               if (title) {
                 createMutation.mutate({ title, description: '' });
                 setTitle('');
               }
            }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-all"
          >
            Add Task
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['To Do', 'In Progress', 'Completed'].map((status) => (
            <div key={status} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">{status}</h2>
              
              <div className="space-y-3">
                {getTasksByStatus(status as Task['status']).map((task) => (
                  <div key={task._id} className="bg-gray-800 p-4 rounded-lg border border-gray-600 shadow-sm hover:border-gray-500 transition-all group">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {status !== 'To Do' && (
                        <button 
                          onClick={() => updateMutation.mutate({ id: task._id, status: 'To Do' })}
                          className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                        >
                          ← To Do
                        </button>
                      )}
                      {status !== 'In Progress' && (
                        <button 
                          onClick={() => updateMutation.mutate({ id: task._id, status: 'In Progress' })}
                          className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded hover:bg-blue-900"
                        >
                          In Prog
                        </button>
                      )}
                      {status !== 'Completed' && (
                        <button 
                          onClick={() => updateMutation.mutate({ id: task._id, status: 'Completed' })}
                          className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded hover:bg-green-900"
                        >
                          Done →
                        </button>
                      )}
                       <button 
                          onClick={() => deleteMutation.mutate(task._id)}
                          className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded hover:bg-red-900 ml-auto"
                        >
                          ✕
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;