export type UserRole = 'admin' | 'moderator' | 'curator' | 'member';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  location?: string | null;
  website?: string | null;
  interests: string[];
  is_verified: boolean;
  ethical_pledge_signed: boolean;
  photos_count: number;
  followers_count: number;
  following_count: number;
  likes_received_count: number;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover_image_url: string;
  display_order: number;
  photos_count: number;
}

export type PhotoStatus = 'draft' | 'pending_review' | 'published' | 'quarantined' | 'archived';

export interface PhotoExif {
  camera_make?: string | null;
  camera_model?: string | null;
  lens?: string | null;
  focal_length?: string | null;
  aperture?: string | null;
  shutter_speed?: string | null;
  iso?: number | null;
  captured_at?: string | null;
}

export interface Photo {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description?: string | null;
  slug: string;
  
  // Storage & Dimensions
  original_storage_path: string;
  display_url: string;
  thumbnail_url: string;
  aspect_ratio: number;
  width: number;
  height: number;
  file_size_bytes: number;
  mime_type: string;
  
  // EXIF
  exif: PhotoExif;
  
  // Location (safe text)
  location_name?: string | null;
  country?: string | null;
  
  // Flags & Metrics
  status: PhotoStatus;
  is_featured: boolean;
  is_editor_choice: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  
  // Relational joins
  author?: Profile;
  category?: Category;
  tags?: string[];
  is_liked_by_user?: boolean;
  is_saved_by_user?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  photos_count: number;
}

export interface Comment {
  id: string;
  photo_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  author: Profile;
  replies?: Comment[];
}

export interface Collection {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  is_private: boolean;
  cover_photo_id?: string | null;
  cover_photo_url?: string | null;
  photos_count: number;
  created_at: string;
  author?: Profile;
}

export type ChallengeStatus = 'upcoming' | 'active' | 'judging' | 'completed';

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  rules: string;
  cover_image_url: string;
  start_date: string;
  end_date: string;
  status: ChallengeStatus;
  prizes?: string | null;
  entries_count: number;
  winner_photo?: Photo;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor: Profile;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'challenge_award' | 'photo_featured';
  entity_id?: string;
  entity_type?: string;
  is_read: boolean;
  created_at: string;
}
