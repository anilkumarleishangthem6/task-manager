import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, editTask }) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setPriority(editTask.priority);
      setStatus(editTask.status);
      setDueDate(editTask.dueDate ? editTask.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
    }
  }, [editTask, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, priority, status, dueDate: dueDate || null });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm outline-none transition border border-transparent focus:border-purple-500 ${isDark ? 'glass text-white placeholder-white/30' : 'glass-light text-slate-800 placeholder-slate-400'}`;
  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isDark ? 'glass' : 'glass-light'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${isDark ? 'glass text-white/50 hover:text-white' : 'glass-light text-slate-400 hover:text-slate-600'}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${isDark ? 'glass text-white/70 hover:text-white' : 'glass-light text-slate-600 hover:text-slate-800'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 gradient-btn text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
            >
              {loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;