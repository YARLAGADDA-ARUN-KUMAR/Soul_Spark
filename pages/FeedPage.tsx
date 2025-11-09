import React from 'react';
import { Mood } from '../types';
import type { ContentPost, User } from '../types';
import MoodSelector from '../components/MoodSelector';
import ContentFeed from '../components/ContentFeed';

interface FeedPageProps {
    posts: ContentPost[];
    currentMood: Mood | null;
    onMoodChange: (mood: Mood | null) => void;
    likedPosts: Set<string>;
    onToggleLike: (postId: string) => void;
    onAddComment: (postId: string, commentText: string) => void;
    onReportPost: (postId: string) => void;
    currentUser: User | null;
}

const FeedPage: React.FC<FeedPageProps> = ({ posts, currentMood, onMoodChange, likedPosts, onToggleLike, onAddComment, onReportPost, currentUser }) => {
    
    const filteredPosts = currentMood ? posts.filter(post => post.mood === currentMood) : posts;

    return (
        <div className="max-w-4xl mx-auto">
            <MoodSelector selectedMood={currentMood} onSelectMood={onMoodChange} />
            <ContentFeed 
                posts={filteredPosts} 
                likedPosts={likedPosts} 
                onToggleLike={onToggleLike}
                onAddComment={onAddComment}
                onReportPost={onReportPost}
                currentUser={currentUser}
            />
        </div>
    );
};

export default FeedPage;
