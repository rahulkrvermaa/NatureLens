import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Challenge, Comment, Notification, Photo, Profile } from '@/types';
import { DEMO_CATEGORIES, DEMO_CHALLENGES, DEMO_PHOTOS, DEMO_PROFILES } from '@/lib/mockData';
import {
  deleteCommentInDb,
  fetchSupabaseData,
  insertCommentInDb,
  insertPhotoInDb,
  signOutFromSupabase,
  updateChallengeEntriesInDb,
  updatePhotoCountsInDb,
  updateProfileFollowersInDb,
  upsertProfileInDb,
} from '@/services/supabaseService';

export type ThemeMode = 'light' | 'dark';

export interface LiveActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  photoId?: string;
}

interface NatureState {
  theme: ThemeMode;
  dbConnected: boolean;
  schemaMissing: boolean;
  photos: Photo[];
  profiles: Profile[];
  challenges: Challenge[];
  commentsByPhoto: Record<string, Comment[]>;
  notifications: Notification[];
  liveEvents: LiveActivityEvent[];
  currentUser: Profile | null;
  currentUserEmail: string | null;
  likedPhotoIds: string[];
  savedPhotoIds: string[];
  followedUserIds: string[];
  enteredChallengeIds: string[];
  activePhotographers: number;

  // Actions
  initSupabaseSync: () => Promise<boolean>;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleLike: (photoId: string) => boolean;
  toggleSave: (photoId: string) => boolean;
  toggleFollow: (userId: string) => boolean;
  incrementView: (photoId: string) => void;
  addComment: (photoId: string, content: string, parentId?: string | null) => Comment;
  deleteComment: (photoId: string, commentId: string) => void;
  addPhoto: (input: {
    title: string;
    description: string;
    categoryId: string;
    displayUrl: string;
    width: number;
    height: number;
    fileSizeBytes: number;
    mimeType: string;
    locationName?: string;
    cameraModel?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    tags?: string[];
  }) => Photo;
  enterChallenge: (challengeId: string, photoId: string) => void;
  setActivePhotographers: (count: number) => void;
  pushNotification: (notification: Notification) => void;
  setCurrentUser: (user: Profile | null, email?: string | null) => void;
  loginDemo: (email: string) => Profile;
  signupDemo: (input: { fullName: string; username: string; email: string }) => Profile;
  logout: () => void;
  markAllNotificationsRead: () => void;
  tickRealtimeActivity: () => void;
}

const INITIAL_COMMENTS: Record<string, Comment[]> = {};

const VIEWED_SESSION_KEY = 'naturelens-viewed-photos';
const viewedInMemory = new Set<string>();

const hasViewedInSession = (photoId: string): boolean => {
  if (viewedInMemory.has(photoId)) return true;
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.sessionStorage.getItem(VIEWED_SESSION_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw) as string[];
    return Array.isArray(list) && list.includes(photoId);
  } catch {
    return false;
  }
};

const markViewedInSession = (photoId: string) => {
  viewedInMemory.add(photoId);
  if (typeof window === 'undefined') return;
  try {
    const raw = window.sessionStorage.getItem(VIEWED_SESSION_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    if (!list.includes(photoId)) {
      list.push(photoId);
      window.sessionStorage.setItem(VIEWED_SESSION_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore sessionStorage quota/privacy errors
  }
};

const channel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('naturelens-realtime')
    : null;

const applyThemeToDom = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

export const useNatureStore = create<NatureState>()(
  persist(
    (set, get) => {
      const broadcast = (type: string, payload: unknown) => {
        try {
          channel?.postMessage({ type, payload });
        } catch {
          // Ignore broadcast errors in restricted environments
        }
      };

      return {
        theme: 'light',
        dbConnected: false,
        schemaMissing: false,
        photos: DEMO_PHOTOS,
        profiles: DEMO_PROFILES,
        challenges: DEMO_CHALLENGES,
        commentsByPhoto: INITIAL_COMMENTS,
        notifications: [],
        liveEvents: [],
        currentUser: null,
        currentUserEmail: null,
        likedPhotoIds: [],
        savedPhotoIds: [],
        followedUserIds: [],
        enteredChallengeIds: [],
        activePhotographers: 1,

        initSupabaseSync: async () => {
          const data = await fetchSupabaseData();
          if (data.connected) {
            set((state) => ({
              dbConnected: true,
              schemaMissing: false,
              photos: data.photos,
              profiles: data.profiles,
              challenges: data.challenges,
              commentsByPhoto:
                Object.keys(data.commentsByPhoto).length > 0
                  ? data.commentsByPhoto
                  : state.commentsByPhoto,
            }));
          } else {
            set({ dbConnected: false, schemaMissing: data.schemaMissing });
          }
          return data.connected;
        },

        setTheme: (theme) => {
          applyThemeToDom(theme);
          set({ theme });
          broadcast('THEME_CHANGE', theme);
        },

        toggleTheme: () => {
          const next: ThemeMode = get().theme === 'light' ? 'dark' : 'light';
          applyThemeToDom(next);
          set({ theme: next });
          broadcast('THEME_CHANGE', next);
        },

        toggleLike: (photoId) => {
          const { likedPhotoIds, photos, currentUser, liveEvents, dbConnected } = get();
          const alreadyLiked = likedPhotoIds.includes(photoId);
          const nextLikedIds = alreadyLiked
            ? likedPhotoIds.filter((id) => id !== photoId)
            : [...likedPhotoIds, photoId];

          const targetPhoto = photos.find((p) => p.id === photoId);
          const nextLikesCount = targetPhoto
            ? Math.max(0, targetPhoto.likes_count + (alreadyLiked ? -1 : 1))
            : 0;

          const nextPhotos = photos.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  likes_count: nextLikesCount,
                  is_liked_by_user: !alreadyLiked,
                }
              : p
          );

          const actorName = currentUser?.full_name || 'You';
          const nextEvents =
            !alreadyLiked && targetPhoto
              ? [
                  {
                    id: `ev-${Date.now()}`,
                    message: `${actorName} liked "${targetPhoto.title}"`,
                    timestamp: new Date().toISOString(),
                    photoId,
                  },
                  ...liveEvents.slice(0, 9),
                ]
              : liveEvents;

          set({
            likedPhotoIds: nextLikedIds,
            photos: nextPhotos,
            liveEvents: nextEvents,
          });
          broadcast('SYNC_STATE', { likedPhotoIds: nextLikedIds, photos: nextPhotos });
          if (dbConnected && targetPhoto) {
            void updatePhotoCountsInDb(photoId, { likes_count: nextLikesCount });
          }
          return !alreadyLiked;
        },

        toggleSave: (photoId) => {
          const { savedPhotoIds, photos, dbConnected } = get();
          const alreadySaved = savedPhotoIds.includes(photoId);
          const nextSavedIds = alreadySaved
            ? savedPhotoIds.filter((id) => id !== photoId)
            : [...savedPhotoIds, photoId];

          const targetPhoto = photos.find((p) => p.id === photoId);
          const nextSavesCount = targetPhoto
            ? Math.max(0, targetPhoto.saves_count + (alreadySaved ? -1 : 1))
            : 0;

          const nextPhotos = photos.map((p) =>
            p.id === photoId
              ? {
                  ...p,
                  saves_count: nextSavesCount,
                  is_saved_by_user: !alreadySaved,
                }
              : p
          );

          set({ savedPhotoIds: nextSavedIds, photos: nextPhotos });
          broadcast('SYNC_STATE', { savedPhotoIds: nextSavedIds, photos: nextPhotos });
          if (dbConnected && targetPhoto) {
            void updatePhotoCountsInDb(photoId, { saves_count: nextSavesCount });
          }
          return !alreadySaved;
        },

        toggleFollow: (userId) => {
          const { followedUserIds, profiles, liveEvents, dbConnected } = get();
          const alreadyFollowing = followedUserIds.includes(userId);
          const nextFollowed = alreadyFollowing
            ? followedUserIds.filter((id) => id !== userId)
            : [...followedUserIds, userId];

          const target = profiles.find((p) => p.id === userId);
          const nextFollowers = target
            ? Math.max(0, target.followers_count + (alreadyFollowing ? -1 : 1))
            : 0;

          const nextProfiles = profiles.map((p) =>
            p.id === userId ? { ...p, followers_count: nextFollowers } : p
          );

          const nextEvents =
            !alreadyFollowing && target
              ? [
                  {
                    id: `ev-${Date.now()}`,
                    message: `Started following ${target.full_name}`,
                    timestamp: new Date().toISOString(),
                  },
                  ...liveEvents.slice(0, 9),
                ]
              : liveEvents;

          set({
            followedUserIds: nextFollowed,
            profiles: nextProfiles,
            liveEvents: nextEvents,
          });
          if (dbConnected && target) {
            void updateProfileFollowersInDb(userId, nextFollowers);
          }
          return !alreadyFollowing;
        },

        incrementView: (photoId) => {
          if (hasViewedInSession(photoId)) return;
          markViewedInSession(photoId);

          const { photos, dbConnected } = get();
          const target = photos.find((p) => p.id === photoId);
          const nextViews = target ? target.views_count + 1 : 1;
          set((state) => ({
            photos: state.photos.map((p) =>
              p.id === photoId ? { ...p, views_count: nextViews } : p
            ),
          }));
          if (dbConnected && target) {
            void updatePhotoCountsInDb(photoId, { views_count: nextViews });
          }
        },

        addComment: (photoId, content, parentId = null) => {
          const { currentUser, commentsByPhoto, photos, notifications, liveEvents, dbConnected } = get();
          const author: Profile = currentUser || {
            id: 'usr-guest',
            username: 'nature_explorer',
            full_name: 'Nature Explorer',
            bio: 'Community wildlife & landscape enthusiast.',
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            interests: ['Landscapes', 'Wildlife'],
            is_verified: false,
            ethical_pledge_signed: true,
            photos_count: 0,
            followers_count: 1,
            following_count: 3,
            likes_received_count: 0,
            created_at: new Date().toISOString(),
          };

          const newComment: Comment = {
            id: `cm-${Date.now()}`,
            photo_id: photoId,
            user_id: author.id,
            parent_id: parentId,
            content: content.trim(),
            is_edited: false,
            is_deleted: false,
            created_at: new Date().toISOString(),
            author,
          };

          const existing = commentsByPhoto[photoId] || [];
          const nextComments = {
            ...commentsByPhoto,
            [photoId]: [newComment, ...existing],
          };

          const targetPhoto = photos.find((p) => p.id === photoId);
          const nextCommentsCount = targetPhoto ? targetPhoto.comments_count + 1 : 1;
          const nextPhotos = photos.map((p) =>
            p.id === photoId ? { ...p, comments_count: nextCommentsCount } : p
          );

          const nextNotifs: Notification[] = [
            {
              id: `notif-${Date.now()}`,
              recipient_id: targetPhoto?.user_id || 'usr-1',
              actor: author,
              type: 'comment',
              entity_id: photoId,
              entity_type: 'photo',
              is_read: false,
              created_at: new Date().toISOString(),
            },
            ...notifications,
          ];

          const nextEvents = targetPhoto
            ? [
                {
                  id: `ev-${Date.now()}`,
                  message: `${author.full_name} commented on "${targetPhoto.title}"`,
                  timestamp: new Date().toISOString(),
                  photoId,
                },
                ...liveEvents.slice(0, 9),
              ]
            : liveEvents;

          set({
            commentsByPhoto: nextComments,
            photos: nextPhotos,
            notifications: nextNotifs,
            liveEvents: nextEvents,
          });
          broadcast('NEW_COMMENT', { photoId, comment: newComment });
          if (dbConnected) {
            void insertCommentInDb(newComment);
            if (targetPhoto) {
              void updatePhotoCountsInDb(photoId, { comments_count: nextCommentsCount });
            }
          }
          return newComment;
        },

        deleteComment: (photoId, commentId) => {
          const { commentsByPhoto, photos, dbConnected } = get();
          const existing = commentsByPhoto[photoId] || [];
          const filtered = existing.filter((c) => c.id !== commentId);
          const targetPhoto = photos.find((p) => p.id === photoId);
          const nextCommentsCount = targetPhoto ? Math.max(0, targetPhoto.comments_count - 1) : 0;

          set({
            commentsByPhoto: { ...commentsByPhoto, [photoId]: filtered },
            photos: photos.map((p) =>
              p.id === photoId ? { ...p, comments_count: nextCommentsCount } : p
            ),
          });
          if (dbConnected) {
            void deleteCommentInDb(commentId);
            if (targetPhoto) {
              void updatePhotoCountsInDb(photoId, { comments_count: nextCommentsCount });
            }
          }
        },

        addPhoto: (input) => {
          const { currentUser, photos, profiles, liveEvents, dbConnected } = get();
          const author: Profile = currentUser || DEMO_PROFILES[0];
          const category = DEMO_CATEGORIES.find((c) => c.id === input.categoryId) || DEMO_CATEGORIES[0];
          const slug = input.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

          const newPhoto: Photo = {
            id: `ph-${Date.now()}`,
            user_id: author.id,
            category_id: category.id,
            title: input.title,
            description: input.description,
            slug: slug || `photo-${Date.now()}`,
            original_storage_path: `uploads/${author.id}/${Date.now()}.jpg`,
            display_url: input.displayUrl,
            thumbnail_url: input.displayUrl,
            aspect_ratio: input.height > 0 ? Number((input.width / input.height).toFixed(2)) : 1.5,
            width: input.width || 1920,
            height: input.height || 1280,
            file_size_bytes: input.fileSizeBytes,
            mime_type: input.mimeType || 'image/jpeg',
            exif: {
              camera_model: input.cameraModel || 'Full-Frame Mirrorless',
              lens: input.lens || '24-70mm f/2.8',
              aperture: input.aperture || 'f/5.6',
              shutter_speed: input.shutterSpeed || '1/250s',
              iso: input.iso || 200,
              captured_at: new Date().toISOString(),
            },
            location_name: input.locationName || 'Protected Wilderness',
            country: 'Field Submission',
            status: 'published',
            is_featured: true,
            is_editor_choice: false,
            views_count: 1,
            likes_count: 0,
            comments_count: 0,
            saves_count: 0,
            author,
            category,
            tags: input.tags && input.tags.length > 0 ? input.tags : [category.slug, 'field-capture'],
            is_liked_by_user: false,
            is_saved_by_user: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const nextPhotos = [newPhoto, ...photos];
          const nextProfiles = profiles.map((p) =>
            p.id === author.id ? { ...p, photos_count: p.photos_count + 1 } : p
          );
          const nextEvents: LiveActivityEvent[] = [
            {
              id: `ev-${Date.now()}`,
              message: `${author.full_name} published "${newPhoto.title}" in ${category.name}`,
              timestamp: new Date().toISOString(),
              photoId: newPhoto.id,
            },
            ...liveEvents.slice(0, 9),
          ];

          set({
            photos: nextPhotos,
            profiles: nextProfiles,
            liveEvents: nextEvents,
          });
          broadcast('NEW_PHOTO', newPhoto);
          if (dbConnected) {
            void insertPhotoInDb(newPhoto);
          }
          return newPhoto;
        },

        enterChallenge: (challengeId, photoId) => {
          const { challenges, enteredChallengeIds, photos, liveEvents, currentUser, dbConnected } = get();
          if (enteredChallengeIds.includes(challengeId)) return;

          const targetChallenge = challenges.find((c) => c.id === challengeId);
          const targetPhoto = photos.find((p) => p.id === photoId);
          const nextEntriesCount = targetChallenge ? targetChallenge.entries_count + 1 : 1;

          const nextChallenges = challenges.map((c) =>
            c.id === challengeId ? { ...c, entries_count: nextEntriesCount } : c
          );

          const nextEvents =
            targetChallenge && targetPhoto
              ? [
                  {
                    id: `ev-${Date.now()}`,
                    message: `${currentUser?.full_name || 'Member'} entered "${targetPhoto.title}" into ${targetChallenge.title}`,
                    timestamp: new Date().toISOString(),
                    photoId,
                  },
                  ...liveEvents.slice(0, 9),
                ]
              : liveEvents;

          set({
            challenges: nextChallenges,
            enteredChallengeIds: [...enteredChallengeIds, challengeId],
            liveEvents: nextEvents,
          });
          if (dbConnected && targetChallenge) {
            void updateChallengeEntriesInDb(challengeId, nextEntriesCount);
          }
        },

        setActivePhotographers: (count) => {
          set({ activePhotographers: Math.max(1, count) });
        },

        pushNotification: (notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications.slice(0, 19)],
          }));
        },

        setCurrentUser: (user, email = null) => {
          set((state) => ({
            currentUser: user,
            currentUserEmail: user ? (email ?? state.currentUserEmail) : null,
            profiles:
              user && !state.profiles.some((p) => p.id === user.id)
                ? [user, ...state.profiles]
                : state.profiles,
          }));
        },

        loginDemo: (email) => {
          const usernameFromEmail = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_') || 'elena_frost';
          const matched = get().profiles.find(
            (p) => p.username.toLowerCase() === usernameFromEmail.toLowerCase()
          );
          const user: Profile = matched || {
            ...DEMO_PROFILES[0],
            id: `usr-${usernameFromEmail}`,
            username: usernameFromEmail,
            full_name: usernameFromEmail
              .split('_')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
          };
          set({ currentUser: user });
          if (get().dbConnected && !matched) {
            void upsertProfileInDb(user);
          }
          return user;
        },

        signupDemo: ({ fullName, username }) => {
          const cleanUsername = username.replace(/^@/, '').trim() || 'new_photographer';
          const newUser: Profile = {
            id: `usr-${Date.now()}`,
            username: cleanUsername,
            full_name: fullName.trim() || cleanUsername,
            bio: 'Ethical wildlife & landscape photographer on NatureLens.',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            banner_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
            location: 'Global Field Member',
            interests: ['Landscapes', 'Wildlife'],
            is_verified: true,
            ethical_pledge_signed: true,
            photos_count: 0,
            followers_count: 1,
            following_count: 0,
            likes_received_count: 0,
            created_at: new Date().toISOString(),
          };
          set((state) => ({
            currentUser: newUser,
            profiles: [newUser, ...state.profiles],
          }));
          if (get().dbConnected) {
            void upsertProfileInDb(newUser);
          }
          return newUser;
        },

        logout: () => {
          set({ currentUser: null, currentUserEmail: null });
          void signOutFromSupabase();
        },

        markAllNotificationsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          }));
        },

        tickRealtimeActivity: () => {
          // Keep photo likes and views authentic (no synthetic increments).
          set((state) => {
            if (state.dbConnected) return state;
            return {
              activePhotographers: Math.max(1, state.activePhotographers),
            };
          });
        },
      };
    },
    {
      name: 'naturelens-store-v1',
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        likedPhotoIds: state.likedPhotoIds,
        savedPhotoIds: state.savedPhotoIds,
        followedUserIds: state.followedUserIds,
        enteredChallengeIds: state.enteredChallengeIds,
        commentsByPhoto: state.commentsByPhoto,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDom(state.theme);
        }
      },
    }
  )
);

// Cross-tab real-time synchronization listener
if (channel) {
  channel.onmessage = (event) => {
    const { type, payload } = event.data || {};
    if (type === 'THEME_CHANGE' && (payload === 'light' || payload === 'dark')) {
      applyThemeToDom(payload);
      useNatureStore.setState({ theme: payload });
    } else if (type === 'SYNC_STATE' && payload) {
      useNatureStore.setState(payload);
    } else if (type === 'NEW_PHOTO' && payload) {
      useNatureStore.setState((state) => ({
        photos: state.photos.some((p) => p.id === payload.id)
          ? state.photos
          : [payload, ...state.photos],
      }));
    } else if (type === 'NEW_COMMENT' && payload?.photoId && payload?.comment) {
      useNatureStore.setState((state) => {
        const existing = state.commentsByPhoto[payload.photoId] || [];
        if (existing.some((c) => c.id === payload.comment.id)) return state;
        return {
          commentsByPhoto: {
            ...state.commentsByPhoto,
            [payload.photoId]: [payload.comment, ...existing],
          },
          photos: state.photos.map((p) =>
            p.id === payload.photoId ? { ...p, comments_count: p.comments_count + 1 } : p
          ),
        };
      });
    }
  };
}
