import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, User, Search, Menu, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useNews();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <Trophy className="w-8 h-8 text-yellow-500 group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                PitchPulse
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-yellow-500 font-bold transition-colors">News</Link>
            <Link to="/live" className="text-slate-300 hover:text-yellow-500 font-bold transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live
            </Link>
            <Link to="/predictions" className="text-slate-300 hover:text-yellow-500 font-bold transition-colors">Predictions</Link>
            <Link to="/leagues" className="text-slate-300 hover:text-yellow-500 font-bold transition-colors">Leagues</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
              <input
                type="text"
                placeholder="Search news..."
                className={`w-full bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-all ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                value={searchTerm}
                onChange={handleSearch}
              />
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-0 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 text-xs font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{user.displayName || user.email.split('@')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-slate-800 text-red-400 hover:text-red-500 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-full font-semibold transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            <button className="md:hidden p-2 hover:bg-slate-800 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
