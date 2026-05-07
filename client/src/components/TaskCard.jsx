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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white font-semibold text-base leading-snug">{task.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="text-slate-400 hover:text-blue-400 text-sm transition"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-slate-400 hover:text-red-400 text-sm transition"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        {isOverdue && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
            Overdue
          </span>
        )}
      </div>

      {task.dueDate && (
        <p className={`text-xs mb-3 ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
          📅 Due: {formatDate(task.dueDate)}
        </p>
      )}

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="w-full bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition"
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};

export default TaskCard;