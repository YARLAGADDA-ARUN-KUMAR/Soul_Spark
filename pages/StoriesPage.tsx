import React from 'react';
import { ContentType } from '../types';
import type { ContentPost, User } from '../types';
import ContentFeed from '../components/ContentFeed';

interface StoriesPageProps {
    posts: ContentPost[];
    likedPosts: Set<string>;
    onToggleLike: (postId: string) => void;
    onAddComment: (postId: string, commentText: string) => void;
    onReportPost: (postId: string) => void;
    currentUser: User | null;
}

const StoriesPage: React.FC<StoriesPageProps> = ({ posts, likedPosts, onToggleLike, onAddComment, onReportPost, currentUser }) => {
    
    const storyPosts = posts.filter(post => post.contentType === ContentType.Story);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-white font-serif">Shared Stories</h2>
                <p className="text-gray-400 mt-2">Discover the journeys, lessons, and moments that connect us.</p>
            </div>
            <ContentFeed 
                posts={storyPosts}
                likedPosts={likedPosts}
                onToggleLike={onToggleLike}
                onAddComment={onAddComment}
                onReportPost={onReportPost}
                currentUser={currentUser}
            />
        </div>
    );
};

export default StoriesPage;
