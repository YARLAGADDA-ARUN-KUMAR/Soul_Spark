import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { ContentPost, User } from '../types';
import ContentFeed from '../components/ContentFeed';
import { UserCircleIcon } from '../components/common/Icons';

interface ProfilePageProps {
    posts: ContentPost[];
    likedPosts: Set<string>;
    onToggleLike: (postId: string) => void;
    onAddComment: (postId: string, commentText: string) => void;
    onReportPost: (postId: string) => void;
    currentUser: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ posts, likedPosts, onToggleLike, onAddComment, onReportPost, currentUser }) => {
    const { user } = useAuth();

    if (!user) {
        return null; // Should be protected by router
    }

    const userPosts = posts.filter(post => post.author === user.username);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-8 bg-gray-900/50 border border-gray-700 rounded-2xl mb-8">
                <UserCircleIcon className="w-24 h-24 text-brand-purple" />
                <h2 className="mt-4 text-3xl font-bold text-white">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-4">Your Posts</h3>
            <ContentFeed 
                posts={userPosts} 
                likedPosts={likedPosts}
                onToggleLike={onToggleLike}
                onAddComment={onAddComment}
                onReportPost={onReportPost}
                currentUser={currentUser}
            />
        </div>
    );
};

export default ProfilePage;
