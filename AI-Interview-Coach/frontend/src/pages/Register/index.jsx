import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex-grow flex h-full">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow for small screens */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-indigo-900/20 to-slate-950" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800 relative z-10"
        >
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Create an account</h2>
            <p className="mt-2 text-sm text-slate-400">Join AI Interview Coach today.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                   <input
                     {...register("first_name")}
                     className="appearance-none block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                     placeholder="John"
                   />
                   {errors.first_name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.first_name.message}</p>}
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                   <input
                     {...register("last_name")}
                     className="appearance-none block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                     placeholder="Doe"
                   />
                   {errors.last_name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.last_name.message}</p>}
                 </div>
               </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                <input
                  {...register("email")}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="appearance-none block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/25"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </div>
            
            <div className="text-center text-sm pt-4 border-t border-slate-800">
              <span className="text-slate-400">Already have an account? </span>
              <Link to="/login" className="font-bold text-white hover:text-cyan-400 transition-colors">Sign in</Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/40 to-slate-900 z-10" />
        <img 
          src="/images/auth_background.jpg" 
          alt="AI Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute bottom-10 right-10 z-20 text-right">
          <h2 className="text-3xl font-bold text-white mb-2">Elevate Your Career</h2>
          <p className="text-purple-200 text-lg">Practice, learn, and succeed with intelligent feedback.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

