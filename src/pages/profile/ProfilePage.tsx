import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Grid,
  Layers,
  Info,
  LayoutGrid,
  Globe,
  Bookmark,
} from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { WallpaperGridCard } from '@/components/gallery/WallpaperGridCard';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { formatCompactNumber } from '@/lib/utils';
import { Photo } from '@/types';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { showToast } = useToast();

  const profiles = useNatureStore((s) => s.profiles);
  const currentUser = useNatureStore((s) => s.currentUser);
  const currentUserEmail = useNatureStore((s) => s.currentUserEmail);
  const photos = useNatureStore((s) => s.photos);
  const savedPhotoIds = useNatureStore((s) => s.savedPhotoIds);
  const followedUserIds = useNatureStore((s) => s.followedUserIds);
  const toggleFollow = useNatureStore((s) => s.toggleFollow);

  const [activeTab, setActiveTab] = useState<'photos' | 'saved' | 'about'>('photos');
  const [viewMode, setViewMode] = useState<'wallpaper' | 'masonry'>('wallpaper');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only treat root /:username as a profile handle when prefixed with @ (unless matched under /profile/:username)
  const isProfileRoute =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/profile/');
  if (username && !username.startsWith('@') && !isProfileRoute) {
    return <NotFoundPage />;
  }

  const cleanUsername = username?.replace(/^@/, '');
  const profile =
    (currentUser && currentUser.username === cleanUsername ? currentUser : undefined) ||
    profiles.find((p) => p.username === cleanUsername) ||
    profiles[0];
  const userPhotos = photos.filter((p) => p.user_id === profile.id);
  const savedPhotos = photos.filter((p) => savedPhotoIds.includes(p.id));
  const isFollowing = followedUserIds.includes(profile.id);

  const handleCardClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleFollowToggle = () => {
    const next = toggleFollow(profile.id);
    showToast(next ? `Following ${profile.full_name}` : `Unfollowed ${profile.full_name}`, 'info');
  };

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-nature-surface border border-nature-border h-64 sm:h-80 shadow-sm">
        {profile.banner_url ? (
          <img
            src={profile.banner_url}
            alt={`${profile.full_name}'s banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-100 to-amber-50 dark:from-stone-900 dark:to-amber-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      </div>

      {/* Profile Header & Stats */}
      <div className="relative -mt-20 sm:-mt-24 px-4 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          <Avatar
            src={profile.avatar_url}
            alt={profile.full_name}
            size="xl"
            isVerified={profile.is_verified}
            className="ring-4 ring-nature-surface rounded-full shadow-lg"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white drop-shadow-md">
                {profile.full_name}
              </h1>
              {profile.is_verified && (
                <span title="Verified Photographer" className="inline-flex">
                  <ShieldCheck className="w-5 h-5 text-nature-accent drop-shadow" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 font-mono drop-shadow">
              @{profile.username}
              {currentUser?.id === profile.id && currentUserEmail ? ` · ${currentUserEmail}` : ''}
            </p>
            {profile.location && (
              <div className="flex items-center gap-1.5 text-xs text-amber-200 drop-shadow">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            onClick={handleFollowToggle}
            className="px-6"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>

      {/* Bio & Engagement Numbers */}
      <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        <div className="md:col-span-8 space-y-4">
          <p className="text-sm sm:text-base text-nature-parchment/90 leading-relaxed font-light">
            {profile.bio}
          </p>
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-nature-accent hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{profile.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        <div className="md:col-span-4 grid grid-cols-3 gap-4 text-center p-4 rounded-2xl bg-nature-surface border border-nature-border shadow-sm">
          <div>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-nature-parchment">
              {Math.max(profile.photos_count, userPhotos.length)}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-nature-textMuted">Works</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-nature-parchment">
              {formatCompactNumber(profile.followers_count)}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-nature-textMuted">Followers</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-nature-parchment">
              {formatCompactNumber(profile.likes_received_count)}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-nature-textMuted">Likes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-nature-border flex items-center gap-8 px-4 sm:px-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'photos'
              ? 'border-nature-accent text-nature-accent'
              : 'border-transparent text-nature-textMuted hover:text-nature-parchment'
          }`}
        >
          <Grid className="w-4 h-4" />
          Photographs ({userPhotos.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-nature-accent text-nature-accent'
              : 'border-transparent text-nature-textMuted hover:text-nature-parchment'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Collection ({savedPhotos.length})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'about'
              ? 'border-nature-accent text-nature-accent'
              : 'border-transparent text-nature-textMuted hover:text-nature-parchment'
          }`}
        >
          <Info className="w-4 h-4" />
          About & Gear
        </button>
      </div>

      {/* Tab Panels */}
      <div className="px-4 sm:px-8">
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-nature-textMuted font-mono">
                {userPhotos.length} published high-resolution works
              </span>
              <div className="flex items-center gap-1 bg-nature-elevated p-1 rounded-full border border-nature-border">
                <button
                  onClick={() => setViewMode('wallpaper')}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewMode === 'wallpaper'
                      ? 'bg-nature-accent text-white'
                      : 'text-nature-textMuted hover:text-nature-parchment'
                  }`}
                  title="Uniform 16:10 Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-1.5 rounded-full transition-colors ${
                    viewMode === 'masonry'
                      ? 'bg-nature-accent text-white'
                      : 'text-nature-textMuted hover:text-nature-parchment'
                  }`}
                  title="Masonry Gallery View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === 'wallpaper' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userPhotos.map((photo, index) => (
                  <WallpaperGridCard
                    key={photo.id}
                    photo={photo}
                    onClick={handleCardClick}
                    priority={index < 4}
                  />
                ))}
              </div>
            ) : (
              <MasonryGrid
                photos={userPhotos}
                priorityCount={3}
                onOpenLightbox={handleCardClick}
              />
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            {savedPhotos.length === 0 ? (
              <div className="p-10 rounded-3xl bg-nature-surface border border-nature-border text-center space-y-2">
                <Layers className="w-8 h-8 text-nature-accent mx-auto opacity-70" />
                <p className="font-serif text-lg text-nature-parchment">No saved photographs yet</p>
                <p className="text-xs text-nature-textMuted">
                  Click the bookmark icon on any photograph in Explore to save it here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedPhotos.map((photo, index) => (
                  <WallpaperGridCard
                    key={photo.id}
                    photo={photo}
                    onClick={handleCardClick}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-8 rounded-3xl bg-nature-surface border border-nature-border space-y-6 max-w-3xl shadow-sm">
            <h3 className="font-serif text-xl font-medium text-nature-parchment">
              Photographer Bio & Gear
            </h3>
            <p className="text-sm text-nature-textMuted leading-relaxed">
              {profile.bio}
            </p>
            <div className="space-y-2 text-xs">
              <span className="text-nature-accent font-semibold block uppercase tracking-wider">Interests</span>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-nature-dark border border-nature-border text-nature-parchment"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <PhotoDownloadModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
