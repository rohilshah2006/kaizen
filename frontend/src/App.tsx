import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, X } from 'lucide-react';
import { clsx } from 'clsx';

import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  updateTaskStatus, 
  deleteTask 
} from './api';
import type { Task } from './types';
import { TaskColumn } from './components/TaskColumn';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';

const COLUMNS = ['To Do', 'In Progress', 'Completed'] as const;

function App() {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'All'>('All');

  // 1. Fetch Tasks
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // 1.5 Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // 3. DND Config
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t._id === activeId);
    const overTask = tasks.find(t => t._id === overId);
    
    // Find if we are hovering over a column
    const isOverAColumn = COLUMNS.includes(overId as any);

    if (activeTask && (overTask || isOverAColumn)) {
      const newStatus = isOverAColumn ? overId : overTask?.status;
      
      if (activeTask.status !== newStatus) {
        // Optimistic update for status change during drag
        queryClient.setQueryData(['tasks'], (old: Task[]) => {
          return old.map(t => t._id === activeId ? { ...t, status: newStatus as Task['status'] } : t);
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t._id === activeId);
    if (!activeTask) return;

    const isOverAColumn = COLUMNS.includes(overId as any);
    const newStatus = isOverAColumn ? overId : tasks.find(t => t._id === overId)?.status;

    if (newStatus && activeTask.status !== newStatus) {
      updateStatusMutation.mutate({ id: activeId as string, status: newStatus as Task['status'] });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Connection Failed</h2>
        <p className="text-gray-400 mb-6">
          Could not connect to the backend server. Please ensure the API is running at http://localhost:5001.
        </p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
          className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-16 px-2">
          <div className="flex items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <div className="h-4 w-4 border-2 border-white rounded-sm" />
                </div>
                <span className="text-gray-500 font-bold tracking-widest text-xs uppercase">Project Dashboard</span>
              </div>
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                Kaizen.
              </h1>
            </div>

            <div className="hidden xl:block h-12 w-px bg-gray-800" />

            <div className="flex-1 flex flex-col md:flex-row items-center gap-4 min-w-[400px]">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-12 pr-10 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-gray-900/50 p-1 border border-gray-800 rounded-2xl">
                <div className="pl-3 pr-2 text-gray-500">
                  <Filter size={14} />
                </div>
                {(['All', 'Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={clsx(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      priorityFilter === p 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-xs shrink-0 self-start xl:self-center">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
            >
              <div className="h-5 w-5 bg-white/20 rounded-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-lg">+</span>
              </div>
              Add New Task
            </button>
          </div>
        </header>

        {/* Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COLUMNS.map((column) => (
              <TaskColumn
                key={column}
                id={column}
                title={column}
                tasks={filteredTasks.filter(t => t.status === column)}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>

          {createPortal(
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.4',
                  },
                },
              }),
            }}>
              {activeTask ? (
                <TaskCard 
                  task={activeTask} 
                  onEdit={() => {}} 
                  onDelete={() => {}} 
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(updated) => updateMutation.mutate(updated)}
      />

      {/* Create Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        task={null}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(newTask) => {
          const { _id, ...rest } = newTask; // Remove null _id
          createMutation.mutate(rest);
        }}
      />

    </div>
  );
}

export default App;