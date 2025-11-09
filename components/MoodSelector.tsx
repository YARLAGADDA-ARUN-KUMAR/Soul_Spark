import React from 'react';
import { Mood } from '../types';
import { HeartIcon, LightBulbIcon, PencilIcon, RocketLaunchIcon, SparklesIcon, SunIcon, ShieldCheckIcon, ShieldExclamationIcon, UsersIcon, GlobeAltIcon } from './common/Icons';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood | null) => void;
}

const moodOptions = [
  { mood: null, icon: <GlobeAltIcon className="w-6 h-6" />, color: 'gray', label: 'All' },
  { mood: Mood.Inspired, icon: <LightBulbIcon className="w-6 h-6" />, color: 'purple' },
  { mood: Mood.Joyful, icon: <SunIcon className="w-6 h-6" />, color: 'yellow' },
  { mood: Mood.Grateful, icon: <ShieldCheckIcon className="w-6 h-6" />, color: 'green' },
  { mood: Mood.Romantic, icon: <SparklesIcon className="w-6 h-6" />, color: 'red' },
  { mood: Mood.Motivated, icon: <RocketLaunchIcon className="w-6 h-6" />, color: 'teal' },
  { mood: Mood.Creative, icon: <PencilIcon className="w-6 h-6" />, color: 'blue' },
  { mood: Mood.Heartbroken, icon: <HeartIcon className="w-6 h-6" />, color: 'pink' },
  { mood: Mood.Anxious, icon: <ShieldExclamationIcon className="w-6 h-6" />, color: 'orange' },
  { mood: Mood.Lonely, icon: <UsersIcon className="w-6 h-6" />, color: 'gray' },
];

const colorClasses = {
  purple: { bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-500', ring: 'ring-purple-400' },
  pink: { bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-500', ring: 'ring-pink-400' },
  red: { bg: 'bg-red-600', hoverBg: 'hover:bg-red-500', ring: 'ring-red-400' },
  teal: { bg: 'bg-teal-600', hoverBg: 'hover:bg-teal-500', ring: 'ring-teal-400' },
  blue: { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-500', ring: 'ring-blue-400' },
  yellow: { bg: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-400', ring: 'ring-yellow-300' },
  green: { bg: 'bg-green-600', hoverBg: 'hover:bg-green-500', ring: 'ring-green-400' },
  orange: { bg: 'bg-orange-500', hoverBg: 'hover:bg-orange-400', ring: 'ring-orange-300' },
  gray: { bg: 'bg-gray-600', hoverBg: 'hover:bg-gray-500', ring: 'ring-gray-400' },
};

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="p-4 rounded-xl bg-gray-900/50">
      <h2 className="text-center text-xl font-semibold text-gray-300 mb-4">How are you feeling?</h2>
      <div className="flex justify-center flex-wrap gap-2 sm:gap-4">
        {moodOptions.map(({ mood, icon, color, label }) => {
          const isSelected = selectedMood === mood;
          const colors = colorClasses[color as keyof typeof colorClasses];
          return (
            <button
              key={mood || 'all'}
              onClick={() => onSelectMood(mood)}
              className={`flex flex-col sm:flex-row items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? `${colors.bg} shadow-lg ring-2 ${colors.ring}`
                  : `bg-gray-700 ${colors.hoverBg}`
              }`}
            >
              {icon}
              <span className="text-sm sm:text-base">{label || mood}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;