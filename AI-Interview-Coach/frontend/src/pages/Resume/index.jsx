import React, { useState } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, ArrowRight, Tag, CheckCircle2, XCircle, AlertCircle, Briefcase, Lightbulb, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Resume = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription.trim() !== '') {
      formData.append('job_description', jobDescription);
    }
    
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || error.message || "Upload failed");
    }
    setUploading(false);
  };

  const startInterview = () => {
    navigate('/interview/start', { state: { resume_topics: result.topics } });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 border-green-500/50 bg-green-500/10";
    if (score >= 50) return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
    return "text-red-500 border-red-500/50 bg-red-500/10";
  };
  
  const getScoreColorFill = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreColorBg = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBadgeText = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    return "Poor";
  };

  const SectionScore = ({ label, score }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-300 capitalize">{label.replace('_', ' ')}</span>
        <span className={`font-bold ${getScoreColorFill(score)}`}>{score}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full ${getScoreColorBg(score)}`}
        />
      </div>
    </div>
  );

  const StatusList = ({ items, icon: Icon, colorClass, title }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon size={16} className={colorClass} /> {title}
        </h4>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className={`mt-0.5 ${colorClass}`}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      <h1 className="text-3xl font-bold text-white mb-6">ATS Resume Checker</h1>
      
      {!result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-slate-900 z-0" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <UploadCloud className="mx-auto h-14 w-14 text-cyan-400 mb-4" />
              <h3 className="text-xl font-medium text-white">Upload your resume</h3>
              <p className="text-sm text-slate-400 mt-2">Upload your PDF resume to get an instant, AI-powered ATS score and feedback.</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Description (Optional)</label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to check keyword match and ATS optimization for a specific role..."
                className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none custom-scrollbar"
              />
            </div>
            
            <div className="text-center">
              <input type="file" id="resume" className="hidden" accept=".pdf" onChange={handleFileChange} />
              <label htmlFor="resume" className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 border border-slate-700 rounded-xl shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none transition-colors">
                {file ? "Change File" : "Select PDF File"}
              </label>
              
              {file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-cyan-300 bg-cyan-900/20 py-2 px-4 rounded-lg inline-flex">
                  <FileText size={16} /> {file.name}
                </div>
              )}
              
              {file && (
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all flex justify-center items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Resume...
                      </>
                    ) : 'Analyze Resume'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
          <div className="flex justify-between items-center">
             <button onClick={() => {setResult(null); setFile(null); setJobDescription('');}} className="text-cyan-400 hover:underline text-sm flex items-center gap-1">
               ← Upload Another Resume
             </button>
          </div>
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ATS Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(result.ats_score)}`}>
                {getBadgeText(result.ats_score)}
              </div>
              <h2 className="text-lg font-bold text-slate-300 mb-6">Overall ATS Score</h2>
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * result.ats_score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="50" cy="50" r="45" fill="none" 
                    stroke="currentColor" strokeWidth="8" 
                    strokeDasharray="283" 
                    className={getScoreColorFill(result.ats_score)} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-white">{result.ats_score}</span>
                  <span className="text-xs text-slate-400 mt-1">out of 100</span>
                </div>
              </div>
            </div>

            {/* Keyword Match Card (if job desc provided) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 relative">
              <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-400" size={20}/> Job Match
              </h2>
              {result.job_description ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <span className="text-5xl font-bold text-blue-400 mb-2">
                    {result.ats_details?.keyword_match_percentage || 0}%
                  </span>
                  <span className="text-sm text-slate-400 text-center">Keyword Match Percentage</span>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-6">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.ats_details?.keyword_match_percentage || 0}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-2 rounded-full bg-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500">
                  <Briefcase size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No job description provided.</p>
                </div>
              )}
            </div>

            {/* General AI Feedback */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
               <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                <FileText className="text-purple-400" size={20}/> AI Executive Summary
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1">
                {result.ai_analysis}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Section Scores */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Section Breakdown</h2>
              <div className="space-y-2">
                {result.ats_details?.section_scores && Object.entries(result.ats_details.section_scores).map(([key, score]) => (
                  <SectionScore key={key} label={key} score={score} />
                ))}
              </div>
            </div>

            {/* Right Column: Details & Feedback */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <StatusList 
                      title="Strengths" 
                      items={result.ats_details?.strengths} 
                      icon={CheckCircle2} 
                      colorClass="text-green-400" 
                    />
                    <StatusList 
                      title="Missing Skills" 
                      items={result.ats_details?.missing_skills} 
                      icon={AlertCircle} 
                      colorClass="text-orange-400" 
                    />
                  </div>
                  <div>
                    <StatusList 
                      title="Areas for Improvement" 
                      items={result.ats_details?.weaknesses} 
                      icon={XCircle} 
                      colorClass="text-red-400" 
                    />
                    <StatusList 
                      title="Missing Keywords (vs JD)" 
                      items={result.ats_details?.missing_keywords} 
                      icon={Tag} 
                      colorClass="text-blue-400" 
                    />
                  </div>
                </div>
              </div>

              {/* Actionable Suggestions */}
              {result.ats_details?.suggestions && result.ats_details.suggestions.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" /> Actionable Suggestions
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {result.ats_details.suggestions.map((sug, idx) => (
                      <div key={idx} className="flex gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        <TrendingUp className="text-cyan-400 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-slate-300">{sug}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Interview Prompt */}
              {result.topics && result.topics.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="text-cyan-400" /> Practice Makes Perfect
                    </h2>
                    <p className="text-sm text-slate-400">Based on your resume, we've identified key domains. Start an AI mock interview tailored to your experience.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {result.topics.map((topic, index) => (
                        <span key={index} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={startInterview}
                    className="shrink-0 whitespace-nowrap inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all"
                  >
                    Start Interview <ArrowRight size={18} />
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Resume;
