import React from 'react';
import type { ContentPost, User } from '../types';
import ContentCard from './ContentCard';

interface ContentFeedProps {
  posts: ContentPost[];
  likedPosts: Set<string>;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onReportPost: (postId: string) => void;
  currentUser: User | null;
}

const ContentFeed: React.FC<ContentFeedProps> = ({ posts, likedPosts, onToggleLike, onAddComment, onReportPost, currentUser }) => {
  return (
    <div className="mt-8">
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <ContentCard 
              key={post.id} 
              post={post}
              isLiked={likedPosts.has(post.id)}
              onToggleLike={() => onToggleLike(post.id)}
              onAddComment={onAddComment}
              onReportPost={() => onReportPost(post.id)}
              isReported={!!currentUser && post.reportedBy.includes(currentUser.id)}
              currentUser={currentUser}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-gray-900/50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-400">Nothing here yet...</h3>
          <p className="text-gray-500 mt-2">Try selecting another mood or creating a new post!</p>
        </div>
      )}
    </div>
  );
};

export default ContentFeed;
