import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (search) params.search = search;
      const res = await API.get('/api/tasks', { params });
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority, search]);

  // Socket.io real-time
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

  // Create task
  const handleCreate = async (taskData) => {
    try {
      await API.post('/api/tasks', taskData);
      toast.success('Task created!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  // Update task
  const handleUpdate = async (taskData) => {
    try {
      await API.put(`/api/tasks/${editTask._id}`, taskData);
      toast.success('Task updated!');
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/api/tasks/${id}`);
      toast.success('Task deleted!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Status change
  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/api/tasks/${id}`, { status });
      toast.success('Status updated!');
      fetchTasks();
    } catch (error) {
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

  // Stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inprogress: tasks.filter((t) => t.status === 'inprogress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'To Do', value: stats.todo, color: 'text-slate-400' },
            { label: 'In Progress', value: stats.inprogress, color: 'text-blue-400' },
            { label: 'Done', value: stats.done, color: 'text-green-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={() => { setEditTask(null); setModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition whitespace-nowrap"
          >
            + New Task
          </button>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl mb-4">No tasks found</p>
            <p className="text-slate-500 text-sm">Click "+ New Task" to create your first task</p>
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