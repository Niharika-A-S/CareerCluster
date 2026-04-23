import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ path, label }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
          isActive 
            ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
            : 'text-white/70 hover:text-white hover:bg-white/5'
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] rounded-full" />
        )}
      </Link>
    );
  };

  const mobileNavLinkClass = (path) => `block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
    location.pathname === path 
      ? 'text-white bg-white/10 border-l-4 border-indigo-500 pl-2' 
      : 'text-white/70 hover:text-white hover:bg-white/5'
  }`;

  return (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-sm">
                Career Cluster
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem path="/" label="Home" />
            <NavItem path="/mentors" label="Find Mentors" />
            <NavItem path="/interests" label="Interests" />
            {user?.role === 'mentor' && <NavItem path="/create" label="Create" />}
            <NavItem path="/groups" label="Groups" />
            <NavItem path="/chat" label="Messages" />
            <NavItem path="/dashboard" label="Dashboard" />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                    <span className="text-white text-sm font-medium">
                      {user?.fullName?.[0] || user?.firstName?.[0] || user?.name?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm">{user?.fullName || user?.firstName || user?.name || 'User'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/90 backdrop-blur-xl border-t border-white/10">
            <Link to="/" className={mobileNavLinkClass('/')} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/mentors" className={mobileNavLinkClass('/mentors')} onClick={() => setIsMenuOpen(false)}>Find Mentors</Link>
            <Link to="/interests" className={mobileNavLinkClass('/interests')} onClick={() => setIsMenuOpen(false)}>Interests</Link>
            {user?.role === 'mentor' && <Link to="/create" className={mobileNavLinkClass('/create')} onClick={() => setIsMenuOpen(false)}>Create</Link>}
            <Link to="/groups" className={mobileNavLinkClass('/groups')} onClick={() => setIsMenuOpen(false)}>Groups</Link>
            <Link to="/chat" className={mobileNavLinkClass('/chat')} onClick={() => setIsMenuOpen(false)}>Messages</Link>
            <Link to="/dashboard" className={mobileNavLinkClass('/dashboard')} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
