import React, { useState } from 'react';
import type { ContentPost, User } from '../types';
import { ContentType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { HeartIcon as HeartIconOutline, ChatBubbleBottomCenterTextIcon, QuoteIcon, BookOpenIcon, LightBulbIcon, WinkIcon, ShareIcon, HeartIconSolid, PaperAirplaneIcon, UserIcon, FlagIcon } from './common/Icons';

const contentTypeDetails = {
  [ContentType.Quote]: { icon: <QuoteIcon className="w-4 h-4" />, color: 'bg-indigo-500/80' },
  [ContentType.Lesson]: { icon: <LightBulbIcon className="w-4 h-4" />, color: 'bg-amber-500/80' },
  [ContentType.Story]: { icon: <BookOpenIcon className="w-4 h-4" />, color: 'bg-emerald-500/80' },
  [ContentType.FlirtyLine]: { icon: <WinkIcon className="w-4 h-4" />, color: 'bg-rose-500/80' },
  [ContentType.Haiku]: { icon: <BookOpenIcon className="w-4 h-4" />, color: 'bg-cyan-500/80' },
  [ContentType.Confession]: { icon: <BookOpenIcon className="w-4 h-4" />, color: 'bg-slate-500/80' },
  [ContentType.Affirmation]: { icon: <QuoteIcon className="w-4 h-4" />, color: 'bg-lime-500/80' },
}

interface ContentCardProps {
    post: ContentPost;
    isLiked: boolean;
    onToggleLike: (postId: string) => void;
    onAddComment: (postId: string, commentText: string) => void;
    onReportPost: () => void;
    isReported: boolean;
    currentUser: User | null;
}

const ContentCard: React.FC<ContentCardProps> = ({ post, isLiked, onToggleLike, onAddComment, onReportPost, isReported, currentUser }) => {
  const { user } = useAuth();
  const details = contentTypeDetails[post.contentType];
  const [showCopied, setShowCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleShare = () => {
    navigator.clipboard.writeText(`"${post.content}" - ${post.author}`);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
        onAddComment(post.id, newComment);
        setNewComment("");
    }
  }

  const handleReport = () => {
    if (window.confirm("Are you sure you want to report this post for sensitive content? This action cannot be undone.")) {
        onReportPost();
    }
  }
  
  const backgroundStyle = post.backgroundImage
    ? { backgroundImage: `url(${post.backgroundImage})` }
    : {};

  const backgroundClasses = post.backgroundImage 
    ? 'bg-cover bg-center' 
    : post.backgroundStyle || 'bg-gray-900';

  const isShortContent = post.content.length <= 250;
  const isOwnPost = currentUser?.username === post.author;

  return (
    <div className="bg-gray-900/50 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div 
        className={`relative text-white h-96 ${backgroundClasses}`}
        style={backgroundStyle}
      >
        <div className="p-6 backdrop-blur-sm bg-black/40 h-full flex flex-col justify-between">
          <div className="absolute top-4 right-4 z-10">
            {details && (
              <div className={`flex items-center gap-1.5 text-xs text-white font-semibold px-2 py-1 rounded-full ${details.color} backdrop-blur-sm`}>
                {details.icon}
                <span>{post.contentType}</span>
              </div>
            )}
          </div>

          <div className={`flex-grow flex overflow-hidden ${isShortContent ? 'items-center justify-center' : 'items-start'}`}>
            {isShortContent ? (
                <p className="font-serif text-xl text-center leading-relaxed italic p-4 text-shadow">
                    "{post.content}"
                </p>
            ) : (
                <div className="h-full w-full overflow-x-auto custom-scrollbar py-2">
                    <p 
                        className="font-serif text-lg leading-relaxed italic h-full text-shadow"
                        style={{ columnWidth: '25ch', columnGap: '1.5rem' }}
                    >
                        "{post.content}"
                    </p>
                </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center pt-4 border-t border-white/10">
            <p className="text-sm text-gray-200 font-medium">
              - {post.author}
            </p>
            <div className="flex items-center space-x-4">
              <button onClick={handleShare} className="relative text-gray-200 hover:text-white transition-transform duration-200 ease-in-out active:scale-125 transform hover:scale-110">
                <ShareIcon className="w-5 h-5" />
                {showCopied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-teal text-white text-xs px-2 py-0.5 rounded-md">Copied!</span>}
              </button>
              <button onClick={() => onToggleLike(post.id)} className={`flex items-center space-x-1 transition-all duration-200 ease-in-out active:scale-125 transform hover:scale-110 ${isLiked ? 'text-brand-pink' : 'text-gray-200 hover:text-brand-pink'}`}>
                {isLiked ? <HeartIconSolid className="w-5 h-5" /> : <HeartIconOutline className="w-5 h-5" />}
                <span className="text-sm font-semibold">{post.likes}</span>
              </button>
              <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 text-gray-200 hover:text-brand-teal transition-transform duration-200 ease-in-out active:scale-125 transform hover:scale-110">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{post.comments.length}</span>
              </button>
               <button 
                onClick={handleReport} 
                disabled={isReported || isOwnPost}
                className="flex items-center space-x-1 text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out active:scale-125 transform hover:scale-110"
                title={isOwnPost ? "You cannot report your own post" : (isReported ? "You have already reported this post" : "Report post")}
               >
                <FlagIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{post.reports}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showComments && (
        <div className="p-4 bg-gray-800/50 transition-all duration-500 ease-in-out">
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {post.comments.length > 0 ? (
                post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2 text-sm">
                        <div className="w-7 h-7 mt-0.5 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-4 h-4 text-white"/>
                        </div>
                        <div>
                           <span className="font-semibold text-white">{comment.author}</span>
                           <p className="text-gray-300">{comment.text}</p>
                        </div>
                    </div>
                ))
            ) : <p className="text-sm text-gray-400 text-center py-2">No comments yet. Be the first!</p>
            }
          </div>
          {user && (
            <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center gap-2">
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <button type="submit" className="p-2 text-white bg-brand-teal rounded-full hover:bg-teal-600 disabled:bg-gray-500 transition-colors">
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCard;