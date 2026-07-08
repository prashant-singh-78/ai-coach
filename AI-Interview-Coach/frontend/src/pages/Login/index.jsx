import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="flex-grow flex h-full">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 z-10" />
        <img 
          src="/images/auth_background.jpg" 
          alt="AI Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <img 
          src="/images/auth_illustration.jpg" 
          alt="AI Coach" 
          className="relative z-20 w-3/4 max-w-lg object-contain rounded-2xl shadow-2xl shadow-cyan-900/20"
        />
        <div className="absolute bottom-10 left-10 z-20">
          <h2 className="text-3xl font-bold text-white mb-2">Master Your Interview</h2>
          <p className="text-cyan-100 text-lg">AI-powered coaching to help you land your dream job.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow for small screens */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-indigo-900/20 to-slate-950" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800 relative z-10"
        >
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Please enter your details to sign in.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
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

            <div className="flex items-center justify-between mt-2">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/25"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
            
            <div className="text-center text-sm pt-4 border-t border-slate-800">
              <span className="text-slate-400">Don't have an account? </span>
              <Link to="/register" className="font-bold text-white hover:text-cyan-400 transition-colors">Sign up</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
