import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Mr_Mpbs0000') {
      onLogin(true);
      navigate('/admin-dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600/20 mb-4">
            <ShieldAlert className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Admin <span className="text-purple-500">Panel</span></h1>
          <p className="text-gray-400 text-sm mt-2">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-bold text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Back to Website</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
