import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlayCircle, Award, FileText, Activity, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (error) {
        console.error("Dashboard error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-grow p-6 lg:p-8 relative">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950/60 z-10" />
        <img 
          src="/images/dashboard_red.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
      </div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">{user?.first_name || 'Student'}</span>!</h1>
            <p className="text-slate-300 mt-2 text-lg">Here is your interview practice overview.</p>
          </motion.div>
          <Link to="/interview/start" className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-red-500/25 transition-all transform hover:-translate-y-1">
            <PlayCircle size={22} /> New Interview
          </Link>
        </header>

      {/* Stats Cards - Vertical Layout */}
      <div className="flex flex-col gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-4 bg-red-900/30 rounded-xl text-red-400 border border-red-800/50">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Total Interviews</p>
            <p className="text-3xl font-bold text-white mt-1">{data?.total_interviews || 0}</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/40 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-4 bg-orange-900/30 rounded-xl text-orange-400 border border-orange-800/50">
            <Award size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Average Score</p>
            <p className="text-3xl font-bold text-white mt-1">{data?.average_score?.toFixed(1) || '0.0'}<span className="text-xl text-slate-400">/10</span></p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/40 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-rose-900/30 rounded-xl text-rose-400 border border-rose-800/50">
              <FileText size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Resume Status</p>
              <p className="text-xl font-bold text-white mt-1">
                {data?.resume_uploaded ? "Uploaded & Analyzed" : "Not Uploaded"}
              </p>
            </div>
          </div>
          <Link 
            to="/resume" 
            className="relative z-10 mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white font-medium hover:bg-rose-600 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/25 transition-all w-full md:w-auto justify-center"
          >
            {data?.resume_uploaded ? "View Analysis" : "Upload Resume"} <ChevronRight size={18} />
          </Link>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="px-8 py-6 border-b border-white/10 bg-slate-950/30 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Interviews</h2>
        </div>
        <div className="divide-y divide-white/5">
          {data?.recent_interviews?.length > 0 ? (
            data.recent_interviews.map((interview) => (
              <div key={interview.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white capitalize">{interview.category_id}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-medium text-slate-300">{interview.difficulty}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm text-slate-400">{new Date(interview.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    interview.status === 'completed' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {interview.status}
                  </span>
                  {interview.status === 'completed' && (
                    <Link to={`/interview/${interview.id}/result`} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                      View Report <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-white/10">
                <PlayCircle className="text-slate-400" size={32} />
              </div>
              <p className="text-lg font-medium text-slate-200 mb-2">No interviews taken yet.</p>
              <p className="text-slate-400 text-sm max-w-md">Start your first mock interview to get AI-powered feedback and improve your skills.</p>
              <Link to="/interview/start" className="mt-6 text-red-400 font-medium hover:text-red-300 transition-colors">Start now &rarr;</Link>
            </div>
          )}
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
