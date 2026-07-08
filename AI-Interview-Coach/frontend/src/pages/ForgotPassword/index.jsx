import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");
      await api.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div className="flex-grow flex h-full">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-indigo-900/20 to-slate-950" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800 relative z-10"
        >
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Forgot Password</h2>
            <p className="mt-2 text-sm text-slate-400">Enter your email to receive a reset link.</p>
          </div>
          
          {success ? (
            <div className="mt-8 p-4 bg-cyan-900/40 border border-cyan-800 rounded-xl">
              <p className="text-cyan-100">If that email is registered, we have sent a password reset link. Please check your inbox.</p>
              <div className="mt-6">
                <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {errorMsg && (
                <div className="p-3 bg-red-900/40 border border-red-800 rounded-xl text-red-200 text-sm">
                  {errorMsg}
                </div>
              )}
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
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/25"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
              
              <div className="text-center text-sm pt-4 border-t border-slate-800">
                <Link to="/login" className="font-bold text-white hover:text-cyan-400 transition-colors">Back to Login</Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 z-10" />
        <img 
          src="/images/auth_background.jpg" 
          alt="AI Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute bottom-10 left-10 z-20">
          <h2 className="text-3xl font-bold text-white mb-2">Secure Recovery</h2>
          <p className="text-cyan-100 text-lg">Quickly regain access to your AI Coach account.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
