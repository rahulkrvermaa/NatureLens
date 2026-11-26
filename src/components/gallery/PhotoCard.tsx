import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Eye, MapPin, Maximize2 } from 'lucide-react';
import { Photo } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { formatCompactNumber } from '@/lib/utils';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';

export interface PhotoCardProps {
  photo: Photo;
  priority?: boolean;
  onOpenLightbox?: (photo: Photo) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  priority = false,
  onOpenLightbox,
}) => {
  const { showToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const likedPhotoIds = useNatureStore((s) => s.likedPhotoIds);
  const savedPhotoIds = useNatureStore((s) => s.savedPhotoIds);
  const toggleLike = useNatureStore((s) => s.toggleLike);
  const toggleSave = useNatureStore((s) => s.toggleSave);

  const isLiked = likedPhotoIds.includes(photo.id) || (photo.is_liked_by_user ?? false);
  const isSaved = savedPhotoIds.includes(photo.id) || (photo.is_saved_by_user ?? false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextLiked = toggleLike(photo.id);
    showToast(nextLiked ? 'Added to liked photographs' : 'Removed from liked', 'info');
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = toggleSave(photo.id);
    showToast(nextSaved ? 'Saved to your collection' : 'Removed from collection', 'info');
  };

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (onOpenLightbox) {
      e.preventDefault();
      e.stopPropagation();
      onOpenLightbox(photo);
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-nature-moss/60 border border-nature-border/80 transition-all duration-300 hover:border-nature-accent/50 hover:shadow-card-glow mb-6 break-inside-avoid">
      <Link to={`/photo/${photo.id}`} className="block relative overflow-hidden">
        {/* Shimmer loading placeholder */}
        {!isLoaded && !hasError && (
          <div
            className="w-full bg-nature-elevated/80 animate-pulse"
            style={{ paddingBottom: `${(1 / photo.aspect_ratio) * 100}%` }}
          />
        )}

        {/* The Nature Photograph */}
        <img
          src={photo.thumbnail_url || photo.display_url}
          alt={photo.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Ambient Vignette Gradient (always visible on mobile/touch; hover-reveal on md+) */}
        <div className="absolute inset-0 bg-gradient-to-t from-nature-dark/90 via-nature-dark/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
          {/* Top Row: Category Pill & Actions */}
          <div className="flex items-center justify-between w-full pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto">
            <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-nature-dark/70 backdrop-blur-md text-nature-accent border border-nature-accent/30">
              {photo.category?.name || 'Nature'}
            </span>
            <div className="flex items-center gap-1.5">
              {onOpenLightbox && (
                <button
                  onClick={handleLightboxClick}
                  className="p-2 rounded-full backdrop-blur-md bg-nature-dark/60 text-nature-parchment hover:bg-nature-accent hover:text-nature-dark transition-all"
                  title="Open Fullscreen Lightbox"
                  aria-label="Open fullscreen lightbox"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleSave}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isSaved
                    ? 'bg-nature-accent text-nature-dark'
                    : 'bg-nature-dark/60 text-nature-parchment hover:bg-nature-accent hover:text-nature-dark'
                }`}
                title={isSaved ? 'Saved in Collection' : 'Save to Collection'}
                aria-label="Save photograph"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Metadata & Quick Interaction */}
          <div className="space-y-2 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto">
            {photo.location_name && (
              <div className="flex items-center gap-1 text-[11px] text-nature-textMuted">
                <MapPin className="w-3 h-3 text-nature-accent" />
                <span className="truncate">{photo.location_name}</span>
              </div>
            )}
            <h3 className="font-serif text-base font-medium text-nature-parchment line-clamp-1 leading-snug">
              {photo.title}
            </h3>

            <div className="flex items-center justify-between pt-1">
              {/* Author */}
              {photo.author && (
                <div className="flex items-center gap-2">
                  <Avatar
                    src={photo.author.avatar_url}
                    alt={photo.author.full_name}
                    size="sm"
                    isVerified={photo.author.is_verified}
                  />
                  <span className="text-xs text-nature-parchment font-medium truncate max-w-[110px]">
                    {photo.author.full_name}
                  </span>
                </div>
              )}

              {/* Engagement Stats & Like Action */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-nature-textMuted">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{formatCompactNumber(photo.views_count)}</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full backdrop-blur-md transition-colors ${
                    isLiked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-nature-dark/60 text-nature-textMuted hover:text-red-400'
                  }`}
                  aria-label="Like photograph"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-red-400' : ''}`} />
                  <span>{formatCompactNumber(photo.likes_count)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
