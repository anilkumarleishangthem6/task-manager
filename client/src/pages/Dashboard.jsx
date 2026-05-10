import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { Search, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Fetch tasks with optional filters
  const fetchTasks = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (search) params.search = search;
      const res = await API.get('/api/tasks', { params });
      setTasks(res.data);
    } catch (_err) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority, search]);

  // Listen for real-time task updates via Socket.io
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('taskCreated', (task) => {
      if (task.user === user?.id) {
        setTasks((prev) => [task, ...prev]);
      }
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on('taskDeleted', ({ id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });

    return () => socket.disconnect();
  }, []);

  const handleCreate = async (taskData) => {
    try {
      await API.post('/api/tasks', taskData);
      toast.success('Task created!');
      fetchTasks();
    } catch (_err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (taskData) => {
    try {
      await API.put(`/api/tasks/${editTask._id}`, taskData);
      toast.success('Task updated!');
      setEditTask(null);
      fetchTasks();
    } catch (_err) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/api/tasks/${id}`);
      toast.success('Task deleted!');
      fetchTasks();
    } catch (_err) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/api/tasks/${id}`, { status });
      toast.success('Status updated!');
      fetchTasks();
    } catch (_err) {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  // Summary stats for the top cards
  const stats = [
    { label: 'Total', value: tasks.length, color: 'from-purple-500 to-cyan-500' },
    { label: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: 'from-slate-400 to-slate-500' },
    { label: 'In Progress', value: tasks.filter((t) => t.status === 'inprogress').length, color: 'from-blue-400 to-blue-600' },
    { label: 'Done', value: tasks.filter((t) => t.status === 'done').length, color: 'from-green-400 to-emerald-600' },
  ];

  const selectClass = `px-4 py-3 rounded-xl text-sm outline-none transition border border-transparent focus:border-purple-500 ${
    isDark ? 'glass text-white/70' : 'glass-light text-slate-600'
  }`;

  return (
    <div className={`min-h-screen ${
      isDark
        ? 'bg-[linear-gradient(135deg,#0f0c29,#302b63,#24243e)]'
        : 'bg-[linear-gradient(135deg,#e0e7ff,#c7d2fe,#ddd6fe)]'
    }`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-5 text-center ${isDark ? 'glass' : 'glass-light'}`}>
              <p className={`text-3xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search, filter and create controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition border border-transparent focus:border-purple-500 ${
                isDark ? 'glass text-white placeholder-white/30' : 'glass-light text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={selectClass}
          >
            <option value="" className='bg-slate-800 text-white'>All Status</option>
            <option value="todo" className='bg-slate-800 text-white'>To Do</option>
            <option value="inprogress" className='bg-slate-800 text-white'>In Progress</option>
            <option value="done" className='bg-slate-800 text-white'>Done</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={selectClass}
          >
            <option value="" className='bg-slate-800 text-white'>All Priority</option>
            <option value="low" className='bg-slate-800 text-white'>Low</option>
            <option value="medium" className='bg-slate-800 text-white'>Medium</option>
            <option value="high" className='bg-slate-800 text-white'>High</option>
          </select>
          <button
            onClick={() => { setEditTask(null); setModalOpen(true); }}
            className="gradient-btn text-white font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        {/* Task grid */}
        {loading ? (
          <div className={`text-center py-20 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-xl mb-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              No tasks found
            </p>
            <p className={`text-sm ${isDark ? 'text-white/25' : 'text-slate-300'}`}>
              Click "New Task" to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit task modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={editTask ? handleUpdate : handleCreate}
        editTask={editTask}
      />
    </div>
  );
};

export default Dashboard;