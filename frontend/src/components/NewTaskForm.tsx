import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task } from '../types';

interface NewTaskFormProps {
  onCreate: (task: Partial<Task>) => void;
}

export function NewTaskForm({ onCreate }: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate({ title, description: '', status: 'To Do', priority: 'Medium', tags: [] });
      setTitle('');
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
      >
        <Plus size={20} className="group-hover:scale-110 transition-transform" />
        <span className="font-bold">Add New Task</span>
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-gray-800 border border-blue-500 rounded-2xl p-4 shadow-xl shadow-blue-500/10"
    >
      <input
        autoFocus
        type="text"
        placeholder="What's the task?"
        className="w-full bg-transparent border-none text-white focus:outline-none text-lg font-semibold mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="flex-1 py-2 px-4 rounded-xl bg-gray-700 text-white text-sm font-bold hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
