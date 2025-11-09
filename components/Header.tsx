import React from 'react';
import { SparklesIcon, HomeIcon, PlusCircleIcon, UserCircleIcon, ChatBubbleLeftRightIcon, QueueListIcon } from './common/Icons';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';

interface HeaderProps {
  onAuthClick: () => void;
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavLink: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-pink text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ onAuthClick, activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-brand-deep-blue/70 backdrop-blur-sm sticky top-0 z-20 py-3 border-b border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => setActivePage('feed')}>
          <SparklesIcon className="w-8 h-8 text-brand-pink" />
          <h1 className="ml-3 text-2xl md:text-3xl font-serif font-bold text-white tracking-wider">
            SoulSpark
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-2">
          <NavLink onClick={() => setActivePage('feed')} isActive={activePage === 'feed'}><HomeIcon className="w-5 h-5" /> Feed</NavLink>
          <NavLink onClick={() => setActivePage('stories')} isActive={activePage === 'stories'}><QueueListIcon className="w-5 h-5" /> Stories</NavLink>
          {user && <NavLink onClick={() => setActivePage('create')} isActive={activePage === 'create'}><PlusCircleIcon className="w-5 h-5" /> Create</NavLink>}
          <NavLink onClick={() => setActivePage('chat')} isActive={activePage === 'chat'}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI Companion</NavLink>
        </nav>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => setActivePage('profile')} className="flex items-center gap-2 text-gray-300 hover:text-white">
                <UserCircleIcon className="w-6 h-6"/>
                <span className="hidden md:inline">Welcome, {user.username}</span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-brand-pink hover:bg-pink-700 text-white font-semibold rounded-full transition-colors duration-300 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
             <button
                onClick={onAuthClick}
                className="px-4 py-2 border border-brand-purple text-white font-semibold rounded-full hover:bg-brand-purple transition-colors duration-300 text-sm"
              >
                Login / Sign Up
              </button>
          )}
        </div>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-around mt-3 border-t border-gray-800 pt-2">
          <NavLink onClick={() => setActivePage('feed')} isActive={activePage === 'feed'}><HomeIcon className="w-6 h-6" /></NavLink>
          <NavLink onClick={() => setActivePage('stories')} isActive={activePage === 'stories'}><QueueListIcon className="w-6 h-6" /></NavLink>
          {user && <NavLink onClick={() => setActivePage('create')} isActive={activePage === 'create'}><PlusCircleIcon className="w-6 h-6" /></NavLink>}
          <NavLink onClick={() => setActivePage('chat')} isActive={activePage === 'chat'}><ChatBubbleLeftRightIcon className="w-6 h-6" /></NavLink>
          {user && <NavLink onClick={() => setActivePage('profile')} isActive={activePage === 'profile'}><UserCircleIcon className="w-6 h-6" /></NavLink>}
      </nav>
    </header>
  );
};

export default Header;