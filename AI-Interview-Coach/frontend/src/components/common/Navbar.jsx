import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, LayoutDashboard, Info, Home as HomeIcon } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedLink = ({ to, icon, text, onClick, isButton }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const firstLetter = text.charAt(0);
  const restText = text.slice(1);

  const handleClick = async (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    
    // Play boom animation
    await controls.start({
      scale: [1, 2.2, 1],
      color: ['inherit', '#facc15', 'inherit'],
      rotate: [0, -15, 15, 0],
      transition: { duration: 0.3, ease: "easeOut" }
    });
    
    // Navigate after animation
    navigate(to);
  };

  if (isButton) {
    return (
      <a href={to} onClick={handleClick} className="relative overflow-hidden group px-6 py-2 rounded-md font-bold text-sm text-slate-300 border border-slate-700 transition-all duration-300 hover:text-slate-950 hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(212,158,31,0.6)] cursor-pointer block">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        <span className="relative z-10 flex items-center justify-center">
          <motion.span animate={controls} className="inline-block origin-bottom">
            {firstLetter}
          </motion.span>
          {restText}
        </span>
      </a>
    );
  }

  return (
    <a href={to} onClick={handleClick} className="text-slate-400 hover:text-primary-500 flex items-center gap-1.5 font-medium text-base transition-colors cursor-pointer">
      {icon}
      <span className="flex items-center">
        <motion.span 
          animate={controls}
          className="inline-block origin-bottom font-bold"
        >
          {firstLetter}
        </motion.span>
        {restText}
      </span>
    </a>
  );
};

const AnimatedButton = ({ onClick, icon, text }) => {
  const controls = useAnimation();
  const firstLetter = text.charAt(0);
  const restText = text.slice(1);

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Play boom animation
    await controls.start({
      scale: [1, 2.2, 1],
      color: ['inherit', '#ef4444', 'inherit'],
      rotate: [0, -15, 15, 0],
      transition: { duration: 0.3, ease: "easeOut" }
    });
    
    if (onClick) onClick(e);
  };

  return (
    <button onClick={handleClick} className="text-slate-400 hover:text-red-500 flex items-center gap-1.5 font-medium text-base transition-colors cursor-pointer">
      {icon}
      <span className="flex items-center">
        <motion.span 
          animate={controls}
          className="inline-block origin-bottom font-bold"
        >
          {firstLetter}
        </motion.span>
        {restText}
      </span>
    </button>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="relative z-50 bg-slate-950 border-b border-primary-900 px-4 py-3 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-500 flex items-center gap-2 font-serif tracking-wide">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 text-slate-950 flex items-center justify-center font-sans font-bold shadow-[0_0_10px_rgba(212,158,31,0.5)]">AI</div>
          <span>Interview Coach</span>
        </Link>
        
        {/* Increased gap from 4 to 8 for more distance between elements */}
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <AnimatedLink to="/" text="Home" icon={<HomeIcon size={18} />} />
              <AnimatedLink to="/about" text="About" icon={<Info size={18} />} />
              <AnimatedLink to="/dashboard" text="Dashboard" icon={<LayoutDashboard size={18} />} />
              <AnimatedLink to="/profile" text={user.first_name || 'Profile'} icon={<User size={18} />} />
              <AnimatedButton onClick={logout} text="Logout" icon={<LogOut size={18} />} />
            </>
          ) : (
            <>
              <AnimatedLink to="/" text="Home" icon={<HomeIcon size={18} />} />
              <AnimatedLink to="/about" text="About" icon={<Info size={18} />} />
              <AnimatedLink to="/login" text="Login" isButton={true} />
              <AnimatedLink to="/register" text="Sign Up" isButton={true} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
