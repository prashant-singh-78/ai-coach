import React from 'react';
import { motion } from 'framer-motion';
import aboutAnime from '../../assets/about_anime.jpg';

const About = () => {
  return (
    <div className="flex-grow p-6 lg:p-10 relative flex justify-center items-center min-h-full">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950/70 z-10" />
        <img 
          src={aboutAnime} 
          alt="Anime student studying" 
          className="w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          <div className="md:w-2/5 h-64 md:h-auto relative">
            <img 
              src={aboutAnime} 
              alt="Anime student" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900/40"></div>
          </div>

          <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">AI Coach</span>
            </h1>
            <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
              <p>
                Preparing for interviews shouldn't be stressful. We built the AI Interview Coach to provide a realistic, domain-specific interview experience that you can access anytime, anywhere.
              </p>
              <p>
                Our platform analyzes your resume, identifies your core technical domains (like Software Engineering, AI, Data Science), and generates targeted interview questions to test your knowledge.
              </p>
              <p>
                Take your time, practice at your own pace, and master your next interview with our comprehensive ATS resume checker and detailed feedback reports.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">100+</span>
                <span className="text-xs text-rose-400 uppercase tracking-wider font-semibold">Questions</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">24/7</span>
                <span className="text-xs text-rose-400 uppercase tracking-wider font-semibold">Availability</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default About;
