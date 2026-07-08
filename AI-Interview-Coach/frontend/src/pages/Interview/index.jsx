import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Interview = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [interview, setInterview] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resumeTopics = location.state?.resume_topics;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get('/interview/categories');
      setCategories(res.data);
      if (res.data.length > 0) setSelectedCategory(res.data[0].id);
    };
    fetchCategories();
  }, []);

  const startInterview = async () => {
    setLoading(true);
    try {
      const payload = { difficulty };
      if (resumeTopics && resumeTopics.length > 0) {
        payload.resume_topics = resumeTopics;
      } else {
        payload.category_id = selectedCategory;
      }
      const res = await api.post('/interview/start', payload);
      setInterview(res.data);
    } catch (error) {
      alert("Failed to start interview.");
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const currentQ = interview.questions[currentQuestionIndex];
      await api.post('/interview/answer', {
        question_id: currentQ.id,
        text: answerText
      });
      
      setAnswerText('');
      if (currentQuestionIndex < interview.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Finish
        await api.post(`/interview/${interview.id}/finish`);
        navigate(`/interview/${interview.id}/result`);
      }
    } catch (error) {
      alert("Failed to submit answer.");
    }
    setSubmitting(false);
  };

  if (!interview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Start a New Mock Interview</h2>
          <div className="space-y-6">
            {resumeTopics && resumeTopics.length > 0 ? (
              <div className="bg-cyan-900/20 border border-cyan-800/50 p-4 rounded-xl mb-4">
                <h3 className="text-cyan-400 font-semibold mb-2">Resume-based Interview</h3>
                <p className="text-slate-300 text-sm">We will generate questions specifically tailored to the skills found in your resume:</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {resumeTopics.map((t, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-700">{t}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Topic</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(Number(e.target.value))} className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button onClick={startInterview} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 mt-8">
              {loading ? 'Generating Questions...' : 'Start Interview'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = interview.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Mock Interview in Progress</h2>
        <span className="bg-cyan-900/40 text-cyan-300 border border-cyan-800 py-1.5 px-4 rounded-full text-sm font-bold">
          Question {currentQuestionIndex + 1} of {interview.questions.length}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${((currentQuestionIndex) / interview.questions.length) * 100}%` }}></div>
      </div>
      
      <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-8 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-xl font-semibold text-white leading-relaxed">{currentQ.text}</h3>
        </div>
        <div className="p-8 flex-grow flex flex-col">
          <label className="block text-sm font-medium text-slate-300 mb-3">Your Answer</label>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="flex-grow w-full bg-slate-800/30 border border-slate-700 text-slate-200 rounded-xl p-5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
            placeholder="Type your detailed answer here. Try to use the STAR method if applicable..."
          ></textarea>
        </div>
        <div className="px-8 py-6 border-t border-slate-800 flex justify-end bg-slate-900">
          <button onClick={submitAnswer} disabled={submitting} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all">
            {submitting ? 'Submitting...' : (currentQuestionIndex === interview.questions.length - 1 ? 'Finish Interview' : 'Next Question')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Interview;
