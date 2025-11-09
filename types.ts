export enum Mood {
  Inspired = "Inspired",
  Joyful = "Joyful",
  Grateful = "Grateful",
  Romantic = "Romantic",
  Motivated = "Motivated",
  Creative = "Creative",
  Heartbroken = "Heartbroken",
  Anxious = "Anxious",
  Lonely = "Lonely",
}

export enum ContentType {
  Quote = "Quote",
  Lesson = "Life Lesson",
  Story = "Story",
  FlirtyLine = "Flirty Line",
  Haiku = "Haiku",
  Confession = "Confession",
  Affirmation = "Affirmation",
}

export interface Comment {
  id: string;
  author: string;
  text: string;
}

export interface ContentPost {
  id: string;
  content: string;
  author: string;
  mood: Mood;
  contentType: ContentType;
  backgroundStyle?: string;
  backgroundImage?: string;
  likes: number;
  comments: Comment[];
  reports: number;
  reportedBy: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id:string;
  username: string;
  email: string;
}

export type Page = 'feed' | 'create' | 'profile' | 'chat' | 'stories';