import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-cyan-100'}`}>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-xl transition ${isDark ? 'glass text-yellow-400' : 'glass-light text-slate-600'}`}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl ${isDark ? 'glass' : 'glass-light'}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Create Account
          </h1>
          <p className={isDark ? 'text-white/50' : 'text-slate-500'}>
            Start managing your tasks today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Full Name
            </label>
            <div className="relative">
              <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition ${isDark ? 'glass text-white placeholder-white/30' : 'glass-light text-slate-800 placeholder-slate-400'} border border-transparent focus:border-purple-500`}
                placeholder="Anil Kumar"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Email
            </label>
            <div className="relative">
              <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition ${isDark ? 'glass text-white placeholder-white/30' : 'glass-light text-slate-800 placeholder-slate-400'} border border-transparent focus:border-purple-500`}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Password
            </label>
            <div className="relative">
              <Lock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition ${isDark ? 'glass text-white placeholder-white/30' : 'glass-light text-slate-800 placeholder-slate-400'} border border-transparent focus:border-purple-500`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;