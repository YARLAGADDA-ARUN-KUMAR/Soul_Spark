import React from 'react';
import PostCreator from '../components/PostCreator';
import type { ContentPost } from '../types';

interface CreatePageProps {
    onPostCreated: (post: Omit<ContentPost, 'id' | 'author' | 'likes' | 'comments' | 'reports' | 'reportedBy'>) => void;
}

const CreatePage: React.FC<CreatePageProps> = ({ onPostCreated }) => {
    return (
        <div>
            <PostCreator onPostCreated={onPostCreated} />
        </div>
    );
};

export default CreatePage;