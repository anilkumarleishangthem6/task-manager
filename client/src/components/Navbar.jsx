import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <nav className={`${isDark ? 'glass' : 'glass-light'} px-6 py-4 sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="font-bold text-xl gradient-text">TaskFlow</h1>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">

          {/* Dark/light mode toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition ${
              isDark ? 'glass text-yellow-400 hover:text-yellow-300' : 'glass-light text-slate-600 hover:text-slate-800'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Desktop: show name and logout button */}
          <div className="hidden sm:flex items-center gap-3">
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Hey,{' '}
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {user?.name}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                isDark ? 'glass text-white/70 hover:text-white' : 'glass-light text-slate-600 hover:text-slate-800'
              }`}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>

          {/* Mobile: avatar with dropdown */}
          <div className="relative sm:hidden" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center text-white font-bold text-sm shadow-lg"
            >
              {firstLetter}
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 top-12 w-48 rounded-2xl shadow-2xl overflow-hidden z-50 ${isDark ? 'glass' : 'glass-light'}`}>
                {/* User info */}
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    Signed in as
                  </p>
                  <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {user?.name}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    {user?.email}
                  </p>
                </div>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition ${
                    isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                  }`}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;