
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './common/Spinner';
import { XMarkIcon } from './common/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      onClose();
    } catch (err) {
      // Error is handled by the context and displayed
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-brand-deep-blue border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <div className="flex border-b border-gray-700 mb-6">
          <button onClick={() => setMode('login')} className={`flex-1 py-2 text-lg font-semibold ${mode === 'login' ? 'text-white border-b-2 border-brand-pink' : 'text-gray-500'}`}>Login</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2 text-lg font-semibold ${mode === 'register' ? 'text-white border-b-2 border-brand-pink' : 'text-gray-500'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-white mb-2">{mode === 'login' ? 'Welcome Back' : 'Join SoulSpark'}</h2>
          
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"/>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"/>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-brand-purple hover:bg-purple-700 text-white font-semibold rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300">
            {isLoading ? <Spinner /> : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
