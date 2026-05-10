import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className={`${isDark ? 'glass' : 'glass-light'} px-6 py-4 sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="font-bold text-xl gradient-text">TaskFlow</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm hidden sm:block ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Hey, <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name}</span>
          </span>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition ${isDark ? 'glass text-yellow-400 hover:text-yellow-300' : 'glass-light text-slate-600 hover:text-slate-800'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${isDark ? 'glass text-white/70 hover:text-white' : 'glass-light text-slate-600 hover:text-slate-800'}`}
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;