import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
      } catch (error) {
        console.error("Profile error", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', profile);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div className="flex-grow p-6 lg:p-10 relative flex justify-center items-start min-h-full">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950/70 z-10" />
        <img 
          src="/images/dashboard_hero.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Your Profile</span>
          </h1>
          <p className="text-slate-300 text-lg">Manage your personal information and settings.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                <input type="text" name="first_name" value={profile.first_name || ''} onChange={handleChange} className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                <input type="text" name="last_name" value={profile.last_name || ''} onChange={handleChange} className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address (Read-only)</label>
              <input type="email" value={user?.email || ''} readOnly className="block w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input type="text" name="phone" value={profile.phone || ''} onChange={handleChange} className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
            </div>
            
            <div className="flex justify-end pt-6 border-t border-slate-800">
              <button type="submit" disabled={saving} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
