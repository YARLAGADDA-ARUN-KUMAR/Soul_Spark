import React from 'react';
import { ContentType } from '../types';
import { QuoteIcon, BookOpenIcon, LightBulbIcon, WinkIcon } from './common/Icons';

interface ContentTypeSelectorProps {
  selectedContentType: ContentType;
  onSelectContentType: (contentType: ContentType) => void;
}

const typeOptions = [
  { type: ContentType.Quote, icon: <QuoteIcon className="w-5 h-5" /> },
  { type: ContentType.Lesson, icon: <LightBulbIcon className="w-5 h-5" /> },
  { type: ContentType.Story, icon: <BookOpenIcon className="w-5 h-5" /> },
  { type: ContentType.FlirtyLine, icon: <WinkIcon className="w-5 h-5" /> },
];

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ selectedContentType, onSelectContentType }) => {
  return (
    <div className="p-3 rounded-xl bg-gray-900/50 flex justify-center flex-wrap gap-2">
      {typeOptions.map(({ type, icon }) => {
        const isSelected = selectedContentType === type;
        return (
          <button
            key={type}
            onClick={() => onSelectContentType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
              isSelected
                ? 'bg-brand-teal text-white shadow-md'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {icon}
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default ContentTypeSelector;