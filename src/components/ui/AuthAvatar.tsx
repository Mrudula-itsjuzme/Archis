import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useStore } from '../../store/useStore';

export default function AuthAvatar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      useStore.getState().setUser(u);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase"
        >
          {user.email ? user.email.substring(0, 2) : 'U'}
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <div className="text-xs font-medium text-gray-800 truncate">{user.email}</div>
            </div>
            <button 
              onClick={() => { signOut(auth); setIsOpen(false); }}
              className="w-full text-left px-4 py-1.5 text-xs text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 transition-colors"
        title="Sign in"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
          <h3 className="text-sm font-bold mb-3">{isLogin ? 'Sign In' : 'Create Account'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-xs">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-2 py-1.5 border border-gray-200 rounded outline-none focus:border-indigo-500" 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="px-2 py-1.5 border border-gray-200 rounded outline-none focus:border-indigo-500" 
              required 
            />
            {error && <div className="text-red-500 text-[10px] leading-tight">{error}</div>}
            <button type="submit" className="mt-1 bg-gray-900 text-white py-1.5 rounded font-semibold hover:bg-black">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-3 text-center text-[10px] text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-semibold hover:underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
