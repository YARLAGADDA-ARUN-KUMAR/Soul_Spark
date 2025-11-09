import React, { useState, useCallback, useEffect } from 'react';
import { Mood, ContentType, Page } from './types';
import type { ContentPost, Comment } from './types';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';

import FeedPage from './pages/FeedPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import StoriesPage from './pages/StoriesPage';
import { backgroundTemplates } from './lib/backgrounds';


const App: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [posts, setPosts] = useState<ContentPost[]>([
    {
      id: '1',
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      mood: Mood.Motivated,
      contentType: ContentType.Quote,
      backgroundStyle: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      likes: 132,
      comments: [],
      reports: 0,
      reportedBy: [],
    },
    {
      id: '2',
      content: "In the midst of chaos, there is also opportunity.",
      author: "Sun Tzu",
      mood: Mood.Inspired,
      contentType: ContentType.Lesson,
      backgroundImage: backgroundTemplates.find(b => b.name === 'Inspired')!.imageUrl,
      likes: 256,
      comments: [
        { id: 'c1', author: 'Jane', text: 'So true!' },
        { id: 'c2', author: 'Alex', text: 'Needed to hear this today.' },
      ],
      reports: 0,
      reportedBy: [],
    },
     {
      id: '3',
      content: "Are you a magician? Because whenever I look at you, everyone else disappears.",
      author: "Sparky",
      mood: Mood.Romantic,
      contentType: ContentType.FlirtyLine,
      backgroundImage: backgroundTemplates.find(b => b.name === 'Romantic')!.imageUrl,
      likes: 489,
      comments: [],
      reports: 0,
      reportedBy: [],
    },
    {
      id: '4',
      content: "It was a cold Tuesday morning when I realized that the greatest lessons aren't learned in classrooms, but in the quiet moments of reflection after a failure. Every stumble, every fall, is not a step backward but a chance to learn the terrain of your own resilience. I remember sitting by the window, watching the rain trace paths on the glass, and it felt like my own journey being mapped out—a series of winding, unpredictable lines that somehow, eventually, led to a clearer view. That's the beauty of it, I think. We don't just endure the storms; we learn to dance in them, finding a rhythm in the chaos that becomes our own unique strength.",
      author: "Jane Doe",
      mood: Mood.Creative,
      contentType: ContentType.Story,
      backgroundStyle: 'bg-gradient-to-br from-sky-500 to-blue-600',
      likes: 88,
      comments: [],
      reports: 0,
      reportedBy: [],
    },
    {
      id: '5',
      content: "The sun paints the sky with gold, a new day's story to unfold.",
      author: "Aura",
      mood: Mood.Joyful,
      contentType: ContentType.Haiku,
      backgroundImage: backgroundTemplates.find(b => b.name === 'Joyful')!.imageUrl,
      likes: 95,
      comments: [],
      reports: 0,
      reportedBy: [],
    },
    {
        id: '6',
        content: "I am worthy of peace, joy, and abundance. I release all that does not serve me.",
        author: "Self",
        mood: Mood.Grateful,
        contentType: ContentType.Affirmation,
        backgroundImage: backgroundTemplates.find(b => b.name === 'Grateful')!.imageUrl,
        likes: 150,
        comments: [],
        reports: 0,
        reportedBy: [],
    },
    {
        id: '7',
        content: "The weight of the world feels heavy today. I confessed my fears to the moon, and it simply listened, bathing me in a soft, silver light. It didn't offer solutions, just presence. And for now, that's enough.",
        author: "Anonymous",
        mood: Mood.Anxious,
        contentType: ContentType.Confession,
        backgroundImage: backgroundTemplates.find(b => b.name === 'Anxious')!.imageUrl,
        likes: 210,
        comments: [],
        reports: 0,
        reportedBy: [],
    },
    {
        id: '8',
        content: "A room full of people, yet an ocean of silence separates my island from the mainland. I hope a friendly ship sails by soon.",
        author: "Wanderer",
        mood: Mood.Lonely,
        contentType: ContentType.Story,
        backgroundImage: backgroundTemplates.find(b => b.name === 'Lonely')!.imageUrl,
        likes: 301,
        comments: [],
        reports: 0,
        reportedBy: [],
    },
    {
        id: '9',
        content: "Sometimes strength is not a roar, but the quiet voice at the end of the day that says, 'I will try again tomorrow.'",
        author: "Hope",
        mood: Mood.Motivated,
        contentType: ContentType.Lesson,
        backgroundImage: backgroundTemplates.find(b => b.name === 'Motivated')!.imageUrl,
        likes: 412,
        comments: [],
        reports: 0,
        reportedBy: [],
    },
    {
      id: '10',
      content: "I forgive myself for yesterday's mistakes and embrace the clean slate of today.",
      author: "Me",
      mood: Mood.Heartbroken,
      contentType: ContentType.Affirmation,
      backgroundImage: backgroundTemplates.find(b => b.name === 'Heartbroken')!.imageUrl,
      likes: 188,
      comments: [],
      reports: 0,
      reportedBy: [],
    }
  ]);
  const [activePage, setActivePage] = useState<Page>('feed');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [userPostCounts, setUserPostCounts] = useState<Record<string, { date: string; count: number }>>({});

  useEffect(() => {
    // Protect routes
    if (!user && (activePage === 'create' || activePage === 'profile')) {
      setActivePage('feed');
      setIsAuthModalOpen(true);
    }
  }, [user, activePage]);

  const handlePostCreated = useCallback((newPost: Omit<ContentPost, 'id' | 'author' | 'likes' | 'comments' | 'reports' | 'reportedBy'>) => {
    if (!user) {
        throw new Error("You must be logged in to post.");
    }

    const today = new Date().toISOString().split('T')[0];
    const userCount = userPostCounts[user.id] || { date: '', count: 0 };

    if (userCount.date === today && userCount.count >= 10) {
        throw new Error("You have reached your daily post limit of 10 posts.");
    }
    
    const newCount = userCount.date === today ? userCount.count + 1 : 1;
    setUserPostCounts(prev => ({ ...prev, [user.id]: { date: today, count: newCount } }));

    const author = user.username;
    setPosts(prevPosts => [
      { ...newPost, id: new Date().toISOString(), author, likes: 0, comments: [], reports: 0, reportedBy: [] },
      ...prevPosts
    ]);
    setActivePage('feed');
  }, [user, userPostCounts]);

  const handleToggleLike = useCallback((postId: string) => {
    setLikedPosts(prevLiked => {
      const newLiked = new Set(prevLiked);
      const isCurrentlyLiked = newLiked.has(postId);
      
      if (isCurrentlyLiked) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
  
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            return { ...p, likes: p.likes + (isCurrentlyLiked ? -1 : 1) };
          }
          return p;
        })
      );
  
      return newLiked;
    });
  }, []);

  const handleAddComment = useCallback((postId: string, commentText: string) => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    };
    const newComment: Comment = {
        id: new Date().toISOString(),
        author: user.username,
        text: commentText,
    };
    setPosts(prevPosts => prevPosts.map(p => 
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  }, [user]);

  const handleReportPost = useCallback((postId: string) => {
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }

    setPosts(prevPosts => {
        // First, map over the posts to update the report count and reporter list
        const updatedPosts = prevPosts.map(post => {
            // If it's not the post we're looking for, or if the user has already reported it, return it as is
            if (post.id !== postId || post.reportedBy.includes(user.id)) {
                return post;
            }

            // Otherwise, it's the correct post and the user hasn't reported it yet.
            // Return a new post object with the updated report information.
            return {
                ...post,
                reports: post.reports + 1,
                reportedBy: [...post.reportedBy, user.id],
            };
        });
        
        // Then, filter out any posts that have reached the report limit
        return updatedPosts.filter(post => post.reports < 15);
    });
  }, [user]);
  
  const renderPage = () => {
    const pageProps = {
      posts,
      likedPosts,
      onToggleLike: handleToggleLike,
      onAddComment: handleAddComment,
      onReportPost: handleReportPost,
      currentUser: user,
    };
    switch(activePage) {
      case 'feed':
        return <FeedPage {...pageProps} currentMood={currentMood} onMoodChange={setCurrentMood} />;
      case 'stories':
        return <StoriesPage {...pageProps} />;
      case 'create':
        return <CreatePage onPostCreated={handlePostCreated} />;
      case 'profile':
        return <ProfilePage {...pageProps} />;
      case 'chat':
        return <ChatPage />;
      default:
        return <FeedPage {...pageProps} currentMood={currentMood} onMoodChange={setCurrentMood} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-deep-blue to-black font-sans">
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onAuthClick={() => setIsAuthModalOpen(true)} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default App;