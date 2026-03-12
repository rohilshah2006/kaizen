import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';
import { clsx } from 'clsx';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskColumn({ id, title, tasks, onEdit, onDelete }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex flex-col bg-gray-900/40 rounded-2xl border border-gray-800/60 p-4 min-h-[500px] transition-colors",
        isOver && "bg-gray-800/60 border-blue-500/30"
      )}
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            {title}
          </h2>
          <span className="flex items-center justify-center bg-gray-800 text-gray-400 text-[10px] h-5 w-5 rounded-full font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
