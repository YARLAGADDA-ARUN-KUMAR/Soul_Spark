import React, { useState, useRef } from 'react';
import { Mood, ContentType } from '../types';
import type { ContentPost } from '../types';
import { generateInspirationalContent, generateBackgroundImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import { SparklesIcon, PhotoIcon } from './common/Icons';
import { backgroundTemplates } from '../lib/backgrounds';

interface PostCreatorProps {
  onPostCreated: (post: Omit<ContentPost, 'id' | 'author' | 'likes' | 'comments' | 'reports' | 'reportedBy'>) => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>(ContentType.Quote);
  const [currentMood, setCurrentMood] = useState<Mood>(Mood.Inspired);
  const [selectedTemplate, setSelectedTemplate] = useState(backgroundTemplates.find(t => t.name === currentMood) || backgroundTemplates[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError('Please write something to post.');
      return;
    }
    
    try {
        onPostCreated({
          content,
          mood: currentMood,
          contentType,
          backgroundStyle: uploadedImage ? undefined : selectedTemplate.style,
          backgroundImage: uploadedImage || selectedTemplate.imageUrl,
        });
        setContent('');
        setUploadedImage(null);
    } catch (err) {
        setError((err as Error).message);
    }
  };

  const handleAIAssist = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const prompt = `a ${contentType.toLowerCase()} about feeling ${currentMood.toLowerCase()}`;
      const generatedContent = await generateInspirationalContent(currentMood, prompt);
      setContent(generatedContent);
    } catch (err) {
      setError('Failed to get inspiration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedTemplate(backgroundTemplates[0]); // Reset template selection
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBackground = async () => {
    if (!content.trim()) {
      setError('Please write something first to generate a background.');
      return;
    }
    setError(null);
    setIsGeneratingImage(true);
    try {
      const base64Data = await generateBackgroundImage(content, currentMood);
      const imageUrl = `data:image/png;base64,${base64Data}`;
      setUploadedImage(imageUrl);
      setSelectedTemplate(backgroundTemplates[0]); // Reset template selection
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };


  const currentBackground = uploadedImage || selectedTemplate.imageUrl;

  return (
    <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <form onSubmit={handlePostSubmit}>
        <h3 className="text-xl font-semibold text-white mb-2">Share your thoughts</h3>
        <p className="text-sm text-gray-400 mb-4">Write your own story, quote, or lesson. Your voice matters here.</p>
        
        <div 
            className="w-full h-48 rounded-lg p-4 flex items-center justify-center bg-cover bg-center transition-all"
            style={{backgroundImage: `url(${currentBackground})`}}
        >
            <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Pour your heart out..."
            className="w-full bg-black/50 border border-gray-600/50 rounded-lg p-3 text-white placeholder-gray-300 focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-center h-full"
            rows={5}
            disabled={isLoading || isGeneratingImage}
            />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">Customize your background</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
              />
              <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-colors text-sm font-semibold"
              >
                  Upload Custom Image
              </button>
              <button 
                  type="button"
                  onClick={handleGenerateBackground}
                  disabled={isGeneratingImage || !content.trim()}
                  className="w-full flex items-center justify-center py-2.5 px-4 border-2 border-dashed border-brand-purple rounded-lg text-brand-light hover:bg-brand-purple/20 hover:border-brand-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                  {isGeneratingImage ? <Spinner /> : <><PhotoIcon className="w-5 h-5 mr-2"/> Generate AI Background</>}
              </button>
          </div>
        </div>


        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="w-full sm:w-auto">
                <label htmlFor="contentType" className="sr-only">Content Type</label>
                <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
                >
                {Object.values(ContentType).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
                </select>
            </div>
             <div className="w-full sm:w-auto">
                <label htmlFor="moodType" className="sr-only">Mood</label>
                <select
                id="moodType"
                value={currentMood}
                onChange={(e) => setCurrentMood(e.target.value as Mood)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
                >
                {Object.values(Mood).map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                ))}
                </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAIAssist}
              disabled={isLoading || isGeneratingImage}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-brand-teal text-brand-teal font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-brand-teal/20"
            >
              {isLoading ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2" /> Inspire</>}
            </button>
            <button
              type="submit"
              disabled={isLoading || isGeneratingImage}
              className="flex-1 px-6 py-2 bg-brand-purple hover:bg-purple-700 text-white font-semibold rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
            >
              Post
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-2 text-center sm:text-right">{error}</p>}
      </form>
    </div>
  );
};

export default PostCreator;