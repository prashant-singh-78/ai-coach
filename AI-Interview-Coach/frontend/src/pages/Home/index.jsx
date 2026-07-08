import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import goldenTheme from '../../assets/attractive_golden_theme.jpg';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-20 px-4 relative overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950/90 z-10" />
        <img 
          src={goldenTheme} 
          alt="Golden Home Background" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 font-serif leading-tight">
          Ace your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-primary-500 to-primary-700 italic drop-shadow-lg">AI Coach</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
          Practice mock interviews, get real-time feedback, and upload your resume for tailored suggestions.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-slate-950 px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(212,158,31,0.5)] hover:shadow-[0_0_30px_rgba(212,158,31,0.7)]">
            Sign Up Now
          </Link>
          <Link to="/login" className="bg-slate-900 hover:bg-slate-800 text-primary-400 border border-primary-800/50 hover:border-primary-500 px-8 py-3 rounded-lg font-medium text-lg transition-all shadow-sm">
            Login
          </Link>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Home;
