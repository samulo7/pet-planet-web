// src/types/entity.ts

export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar: string;
  nickname: string;
  bio: string;
  gender: 0 | 1 | 2;
  follower_count: number;
  following_count: number;
  video_count: number;
  experience_count: number;
  status: 1 | 2;
  reputation_score: number;
  level?: number;
  verified_order_count: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cover_url: string;
  video_url: string;
  transcoded_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  collect_count: number;
  duration: number;
  width: number;
  height: number;
  created_at: string;
  user?: User;
  is_liked?: boolean;
  is_collected?: boolean;
}

export interface PetImage {
  id: number;
  user_id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  type: 1 | 2;
  ai_prompt?: string;
  width: number;
  height: number;
  file_size: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  status: 1 | 2;
  created_at: string;
  user?: User;
}

export interface ExperienceMedia {
  id: number;
  post_id: number;
  media_type: 1 | 2;
  media_id?: number;
  media_url?: string;
  position: number;
  created_at: string;
}

export interface ExperienceCatfood {
  id: number;
  post_id: number;
  catfood_id: number;
  order_image_id?: number;
}

export interface ExperiencePost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  collect_count: number;
  status: 1 | 2 | 3;
  created_at: string;
  updated_at: string;
  user?: User;
  media?: ExperienceMedia[];
  catfoods?: ExperienceCatfood[];
}

export interface PaginatedData<T> {
  list: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface ImageResponse {
  data: PaginatedData<PetImage>;
}

export interface Comment {
  id: number;
  user_id: number;
  target_type: number;
  target_id: number;
  parent_id: number | null;
  content: string;
  like_count: number;
  reply_count: number;
  status: number;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  user?: User;
  replies?: Comment[];
}
