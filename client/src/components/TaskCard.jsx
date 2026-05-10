import { Pencil, Trash2, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const priorityColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors = {
  todo: 'bg-slate-500/20 text-slate-400',
  inprogress: 'bg-blue-500/20 text-blue-400',
  done: 'bg-green-500/20 text-green-400',
};

const statusLabels = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { isDark } = useTheme();

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`rounded-2xl p-5 transition hover:scale-[1.01] ${isDark ? 'glass' : 'glass-light'}`}>
      
      {/* Title + Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className={`font-semibold text-base leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {task.title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2.5 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        {isOverdue && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            Overdue
          </span>
        )}
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center gap-1.5 text-xs mb-3 ${isOverdue ? 'text-red-400' : isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Calendar size={12} />
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
      )}

      {/* Status Select */}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className={`w-full text-sm rounded-xl px-3 py-2 outline-none transition border border-transparent focus:border-purple-500 ${isDark ? 'glass text-white/70' : 'glass-light text-slate-600'}`}
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};

export default TaskCard;