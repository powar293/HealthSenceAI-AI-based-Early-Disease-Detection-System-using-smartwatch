import React, { useState } from 'react';
import { login, signup } from '../services/api';
import { Activity } from 'lucide-react';

export default function Login({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await login(email, password);
        localStorage.setItem('token', data.access_token);
        setAuth(true);
        window.dispatchEvent(new Event('auth-change'));
      } else {
        await signup({ email, password, name });
        const data = await login(email, password);
        localStorage.setItem('token', data.access_token);
        setAuth(true);
        window.dispatchEvent(new Event('auth-change'));
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Server unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center -mt-8 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10 p-6 space-y-6 border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-healthcare-50 mb-6 shadow-inner">
            <Activity className="w-8 h-8 text-healthcare-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Early Disease Detection Intelligence
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 px-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-healthcare-500 focus:bg-white focus:border-healthcare-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 px-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-healthcare-500 focus:bg-white focus:border-healthcare-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 px-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-healthcare-500 focus:bg-white focus:border-healthcare-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-healthcare-600 hover:bg-healthcare-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 mt-2"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In to Dashboard' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 pt-4 border-t border-slate-100">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-healthcare-600 font-bold hover:text-healthcare-700 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
