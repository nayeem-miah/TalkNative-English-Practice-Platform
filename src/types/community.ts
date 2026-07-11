export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    profilePicture?: string;
    level?: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  content?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
    profilePicture?: string;
    level?: string;
    role: string;
  };
  likes?: string[];
  comments?: Comment[];
  createdAt: string;
  image?: string | null;
  isLiked?: boolean;
  _count?: {
    likes?: number;
    comments?: number;
  };
}
