import React, { useState } from 'react';
import { Download, Heart, Bookmark, Eye } from 'lucide-react';
import { Photo } from '@/types';
import { cn, formatCompactNumber } from '@/lib/utils';
import { useToast } from '@/context/useToast';
import { useNatureStore } from '@/store/useNatureStore';

export interface WallpaperGridCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  priority?: boolean;
}

export const WallpaperGridCard: React.FC<WallpaperGridCardProps> = ({
  photo,
  onClick,
  priority = false,
}) => {
  const { showToast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

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

  const captionText = [
    photo.title,
    photo.location_name || photo.country,
    photo.category?.name,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${photo.title}`}
      onClick={() => onClick(photo)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(photo);
        }
      }}
      className="group cursor-pointer flex flex-col space-y-2.5 select-none rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nature-accent"
    >
      {/* 16:10 Image Container */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-nature-surface border border-nature-border shadow-sm transition-all duration-300 group-hover:border-nature-accent/60 group-hover:shadow-md">
        {!isLoaded && (
          <div className="absolute inset-0 bg-nature-elevated animate-pulse" />
        )}

        <img
          src={photo.thumbnail_url || photo.display_url}
          alt={photo.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Action Overlay (always visible on mobile/touch; hover-reveal on md+) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 pointer-events-none">
          <div className="flex items-center justify-between w-full pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white border border-white/20">
              {photo.category?.name || 'Nature'}
            </span>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-all shadow-md',
                isSaved
                  ? 'bg-nature-accent text-white'
                  : 'bg-black/55 text-white hover:bg-nature-accent'
              )}
              title="Save to collection"
              aria-label="Save photograph"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between w-full pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nature-accent text-white text-xs font-semibold shadow-md">
              <Download className="w-3.5 h-3.5" />
              <span>Inspect & Download</span>
            </span>

            <button
              type="button"
              onClick={handleLike}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-all shadow-md',
                isLiked
                  ? 'bg-red-500 text-white border border-red-400'
                  : 'bg-black/55 text-white hover:text-red-400'
              )}
              title="Like photograph"
              aria-label="Like photograph"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Caption & Live Telemetry */}
      <div className="px-1 flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-nature-parchment line-clamp-1 group-hover:text-nature-accent transition-colors">
          {captionText}
        </p>
        <div className="flex items-center gap-2 text-[11px] font-mono text-nature-textSubtle shrink-0">
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatCompactNumber(photo.views_count)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className={cn('w-3 h-3', isLiked && 'fill-red-500 text-red-500')} />
            {formatCompactNumber(photo.likes_count)}
          </span>
        </div>
      </div>
    </div>
  );
};
