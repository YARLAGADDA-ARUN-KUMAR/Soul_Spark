
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LockClosedIcon } from './common/Icons';

interface ProtectedContentProps {
  children: React.ReactNode;
  onUnlock: () => void;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ children, onUnlock }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
      return (
        <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-gray-400">Loading...</p>
        </div>
      )
  }

  if (!user) {
    return (
      <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
        <LockClosedIcon className="w-12 h-12 mx-auto text-gray-500" />
        <h3 className="mt-4 text-xl font-semibold text-white">Content Locked</h3>
        <p className="mt-2 text-gray-400">Please sign in to access this feature.</p>
        <button
          onClick={onUnlock}
          className="mt-6 px-6 py-2 bg-brand-purple hover:bg-purple-700 text-white font-semibold rounded-full transition-colors duration-300"
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;
