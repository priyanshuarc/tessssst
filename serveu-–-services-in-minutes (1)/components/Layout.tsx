
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">S</div>
          <span className="text-xl font-bold tracking-tighter">ServeU</span>
        </Link>
        <div className="flex gap-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            User
          </Link>
          <Link 
            to="/worker" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === '/worker' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            Worker
          </Link>
          <Link 
            to="/about" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === '/about' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            About
          </Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-4xl mx-auto py-8 px-6">
        {children}
      </main>
      <footer className="py-8 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        &copy; 2024 ServeU – Instant Services in Minutes
      </footer>
    </div>
  );
};

export default Layout;
