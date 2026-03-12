import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { GripVertical, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityColors = {
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const isOverdue = task.dueDate && 
                  new Date(task.dueDate) < new Date() && 
                  task.status !== 'Completed';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group relative bg-gray-800 p-4 rounded-xl border border-gray-700/50 shadow-lg hover:border-gray-500 transition-all",
        isDragging && "opacity-50 border-blue-500 scale-105 z-50 cursor-grabbing shadow-2xl",
        isOverdue && "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors"
        >
          <GripVertical size={16} />
        </button>

        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
              priorityColors[task.priority]
            )}>
              {task.priority}
            </span>
            {task.tags?.map(tag => (
              <span key={tag} className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          
          <h3 className="font-semibold text-gray-100 truncate group-hover:text-blue-400 transition-colors">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className={clsx(
              "flex items-center gap-1.5 mt-3 text-[10px] font-medium",
              isOverdue ? "text-red-400" : "text-gray-500"
            )}>
              {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
              <span>{formatDate(task.dueDate)}</span>
              {isOverdue && <span className="uppercase tracking-tighter ml-auto font-bold">Overdue</span>}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="text-gray-600 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
