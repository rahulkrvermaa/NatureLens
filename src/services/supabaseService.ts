import { supabase } from '@/lib/supabase';
import { DEMO_CATEGORIES, DEMO_CHALLENGES, DEMO_PHOTOS, DEMO_PROFILES } from '@/lib/mockData';
import { Challenge, Comment, Photo, Profile } from '@/types';

export interface HydratedData {
  connected: boolean;
  schemaMissing: boolean;
  photos: Photo[];
  profiles: Profile[];
  challenges: Challenge[];
  commentsByPhoto: Record<string, Comment[]>;
}

function enrichPhoto(row: Record<string, unknown>, profiles: Profile[]): Photo {
  const author = profiles.find((p) => p.id === row.user_id) || profiles[0];
  const category = DEMO_CATEGORIES.find((c) => c.id === row.category_id) || DEMO_CATEGORIES[0];
  return {
    ...(row as unknown as Photo),
    author,
    category,
  };
}

export async function seedSupabaseIfEmpty(
  existingProfilesCount: number,
  existingPhotosCount: number,
  existingChallengesCount: number
): Promise<void> {
  if (!supabase) return;

  if (existingProfilesCount === 0) {
    await supabase.from('profiles').upsert(
      DEMO_PROFILES.map((p) => ({
        id: p.id,
        username: p.username,
        full_name: p.full_name,
        bio: p.bio,
        avatar_url: p.avatar_url,
        banner_url: p.banner_url,
        location: p.location,
        website: p.website,
        interests: p.interests,
        is_verified: p.is_verified,
        ethical_pledge_signed: p.ethical_pledge_signed,
        photos_count: p.photos_count,
        followers_count: p.followers_count,
        following_count: p.following_count,
        likes_received_count: p.likes_received_count,
        created_at: p.created_at,
      }))
    );
  }

  if (existingPhotosCount === 0) {
    await supabase.from('photos').upsert(
      DEMO_PHOTOS.map((ph) => ({
        id: ph.id,
        user_id: ph.user_id,
        category_id: ph.category_id,
        title: ph.title,
        description: ph.description,
        slug: ph.slug,
        original_storage_path: ph.original_storage_path,
        display_url: ph.display_url,
        thumbnail_url: ph.thumbnail_url,
        aspect_ratio: ph.aspect_ratio,
        width: ph.width,
        height: ph.height,
        file_size_bytes: ph.file_size_bytes,
        mime_type: ph.mime_type,
        exif: ph.exif,
        location_name: ph.location_name,
        country: ph.country,
        status: ph.status,
        is_featured: ph.is_featured,
        is_editor_choice: ph.is_editor_choice,
        views_count: ph.views_count,
        likes_count: ph.likes_count,
        comments_count: ph.comments_count,
        saves_count: ph.saves_count,
        tags: ph.tags || [],
        created_at: ph.created_at,
        updated_at: ph.updated_at,
      }))
    );
  }

  if (existingChallengesCount === 0) {
    await supabase.from('challenges').upsert(
      DEMO_CHALLENGES.map((ch) => ({
        id: ch.id,
        title: ch.title,
        slug: ch.slug,
        description: ch.description,
        rules: ch.rules,
        cover_image_url: ch.cover_image_url,
        start_date: ch.start_date,
        end_date: ch.end_date,
        status: ch.status,
        prizes: ch.prizes,
        entries_count: ch.entries_count,
      }))
    );
  }
}

export async function fetchSupabaseData(): Promise<HydratedData> {
  if (!supabase) {
    return {
      connected: false,
      schemaMissing: false,
      photos: DEMO_PHOTOS,
      profiles: DEMO_PROFILES,
      challenges: DEMO_CHALLENGES,
      commentsByPhoto: {},
    };
  }

  const [profilesRes, photosRes, challengesRes, commentsRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('photos').select('*').order('created_at', { ascending: false }),
    supabase.from('challenges').select('*').order('start_date', { ascending: false }),
    supabase.from('comments').select('*').order('created_at', { ascending: false }),
  ]);

  const missingTable =
    profilesRes.error?.code === 'PGRST205' ||
    photosRes.error?.code === 'PGRST205' ||
    challengesRes.error?.code === 'PGRST205';

  if (missingTable || profilesRes.error || photosRes.error || challengesRes.error) {
    return {
      connected: false,
      schemaMissing: missingTable,
      photos: DEMO_PHOTOS,
      profiles: DEMO_PROFILES,
      challenges: DEMO_CHALLENGES,
      commentsByPhoto: {},
    };
  }

  const dbProfiles = (profilesRes.data || []) as Profile[];
  const dbPhotos = (photosRes.data || []) as Record<string, unknown>[];
  const dbChallenges = (challengesRes.data || []) as Challenge[];

  if (dbProfiles.length === 0 || dbPhotos.length === 0 || dbChallenges.length === 0) {
    await seedSupabaseIfEmpty(dbProfiles.length, dbPhotos.length, dbChallenges.length);
    return {
      connected: true,
      schemaMissing: false,
      photos: dbPhotos.length > 0 ? dbPhotos.map((r) => enrichPhoto(r, dbProfiles)) : DEMO_PHOTOS,
      profiles: dbProfiles.length > 0 ? dbProfiles : DEMO_PROFILES,
      challenges: dbChallenges.length > 0 ? dbChallenges : DEMO_CHALLENGES,
      commentsByPhoto: {},
    };
  }

  const commentsByPhoto: Record<string, Comment[]> = {};
  (commentsRes.data || []).forEach((row: Record<string, unknown>) => {
    const photoId = String(row.photo_id);
    const comment: Comment = {
      id: String(row.id),
      photo_id: photoId,
      user_id: String(row.user_id),
      parent_id: (row.parent_id as string | null) ?? null,
      content: String(row.content),
      is_edited: Boolean(row.is_edited),
      is_deleted: Boolean(row.is_deleted),
      created_at: String(row.created_at),
      author: (row.author_snapshot as Profile) || dbProfiles[0],
    };
    if (!commentsByPhoto[photoId]) commentsByPhoto[photoId] = [];
    commentsByPhoto[photoId].push(comment);
  });

  return {
    connected: true,
    schemaMissing: false,
    photos: dbPhotos.map((r) => enrichPhoto(r, dbProfiles)),
    profiles: dbProfiles,
    challenges: dbChallenges,
    commentsByPhoto,
  };
}

export async function uploadImageToStorage(file: File, userId: string): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('naturelens-photos')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) return null;

  const { data } = supabase.storage.from('naturelens-photos').getPublicUrl(filePath);
  return data.publicUrl || null;
}

export async function insertPhotoInDb(photo: Photo): Promise<void> {
  if (!supabase) return;
  await supabase.from('photos').insert({
    id: photo.id,
    user_id: photo.user_id,
    category_id: photo.category_id,
    title: photo.title,
    description: photo.description,
    slug: photo.slug,
    original_storage_path: photo.original_storage_path,
    display_url: photo.display_url,
    thumbnail_url: photo.thumbnail_url,
    aspect_ratio: photo.aspect_ratio,
    width: photo.width,
    height: photo.height,
    file_size_bytes: photo.file_size_bytes,
    mime_type: photo.mime_type,
    exif: photo.exif,
    location_name: photo.location_name,
    country: photo.country,
    status: photo.status,
    is_featured: photo.is_featured,
    is_editor_choice: photo.is_editor_choice,
    views_count: photo.views_count,
    likes_count: photo.likes_count,
    comments_count: photo.comments_count,
    saves_count: photo.saves_count,
    tags: photo.tags || [],
    created_at: photo.created_at,
    updated_at: photo.updated_at,
  });
}

export async function updatePhotoCountsInDb(
  photoId: string,
  fields: Partial<Pick<Photo, 'likes_count' | 'saves_count' | 'views_count' | 'comments_count'>>
): Promise<void> {
  if (!supabase) return;
  await supabase.from('photos').update(fields).eq('id', photoId);
}

export async function updateProfileFollowersInDb(userId: string, followersCount: number): Promise<void> {
  if (!supabase) return;
  await supabase.from('profiles').update({ followers_count: followersCount }).eq('id', userId);
}

export async function insertCommentInDb(comment: Comment): Promise<void> {
  if (!supabase) return;
  await supabase.from('comments').insert({
    id: comment.id,
    photo_id: comment.photo_id,
    user_id: comment.user_id,
    parent_id: comment.parent_id ?? null,
    content: comment.content,
    author_snapshot: comment.author,
    is_edited: comment.is_edited,
    is_deleted: comment.is_deleted,
    created_at: comment.created_at,
  });
}

export async function deleteCommentInDb(commentId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('comments').delete().eq('id', commentId);
}

export async function updateChallengeEntriesInDb(challengeId: string, entriesCount: number): Promise<void> {
  if (!supabase) return;
  await supabase.from('challenges').update({ entries_count: entriesCount }).eq('id', challengeId);
}

export async function upsertProfileInDb(profile: Profile): Promise<void> {
  if (!supabase) return;
  await supabase.from('profiles').upsert({
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    banner_url: profile.banner_url,
    location: profile.location,
    website: profile.website,
    interests: profile.interests,
    is_verified: profile.is_verified,
    ethical_pledge_signed: profile.ethical_pledge_signed,
    photos_count: profile.photos_count,
    followers_count: profile.followers_count,
    following_count: profile.following_count,
    likes_received_count: profile.likes_received_count,
    created_at: profile.created_at,
  });
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ userId?: string; email?: string; error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { userId: data.user?.id, email: data.user?.email ?? email };
}

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  fullName: string;
  username: string;
}): Promise<{ userId?: string; needsConfirmation?: boolean; error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        username: input.username,
      },
      emailRedirectTo: `${window.location.origin}/explore`,
    },
  });
  if (error) return { error: error.message };
  return {
    userId: data.user?.id,
    needsConfirmation: !data.session,
  };
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/explore`,
    },
  });
  if (error) return { error: error.message };
  return {};
}

export async function resetPasswordEmail(email: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });
  if (error) return { error: error.message };
  return {};
}

export async function signOutFromSupabase(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function syncAuthUserToProfile(authUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): Promise<Profile> {
  const meta = authUser.user_metadata || {};
  const rawName =
    (meta.full_name as string) ||
    (meta.name as string) ||
    authUser.email?.split('@')[0] ||
    'Photographer';
  const rawUsername =
    ((meta.username as string) || authUser.email?.split('@')[0] || `user_${authUser.id.slice(0, 6)}`)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');

  const profile: Profile = {
    id: authUser.id,
    username: rawUsername,
    full_name: rawName,
    bio: 'Wildlife & nature photographer on NatureLens.',
    avatar_url:
      (meta.avatar_url as string) ||
      (meta.picture as string) ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    banner_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    location: 'Field Member',
    interests: ['Landscapes', 'Wildlife'],
    is_verified: true,
    ethical_pledge_signed: true,
    photos_count: 0,
    followers_count: 0,
    following_count: 0,
    likes_received_count: 0,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (existing) {
      return existing as Profile;
    }
    await upsertProfileInDb(profile);
  }

  return profile;
}
