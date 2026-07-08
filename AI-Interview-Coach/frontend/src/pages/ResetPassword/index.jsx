import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMsg("No reset token found in URL.");
      return;
    }
    try {
      setErrorMsg("");
      await api.post('/auth/reset-password', {
        token: token,
        new_password: data.password
      });
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || "Failed to reset password. The link might be expired.");
    }
  };

  return (
    <div className="flex-grow flex h-full">
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-slate-900 z-10" />
        <img 
          src="/images/auth_background.jpg" 
          alt="AI Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute bottom-10 left-10 z-20 text-left">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-cyan-100 text-lg">Update your password to continue your journey.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-indigo-900/20 to-slate-950" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800 relative z-10"
        >
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Reset Password</h2>
            <p className="mt-2 text-sm text-slate-400">Choose a new, strong password.</p>
          </div>
          
          {success ? (
            <div className="mt-8 p-4 bg-cyan-900/40 border border-cyan-800 rounded-xl">
              <p className="text-cyan-100">Your password has been successfully reset.</p>
              <div className="mt-6">
                <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors">
                  Login Now
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
                  <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    className="appearance-none block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    className="appearance-none block w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/25"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
