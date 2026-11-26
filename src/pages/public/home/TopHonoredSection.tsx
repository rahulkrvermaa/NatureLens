import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Heart, Eye, Bookmark, ArrowRight, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { formatCompactNumber } from '@/lib/utils';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';
import { Photo } from '@/types';

export interface TopHonoredSectionProps {
  onPhotoClick?: (photo: Photo) => void;
}

const getHonorScore = (photo: Photo): number =>
  photo.likes_count * 10 + photo.views_count;

export const TopHonoredSection: React.FC<TopHonoredSectionProps> = ({ onPhotoClick }) => {
  const { showToast } = useToast();
  const photos = useNatureStore((s) => s.photos);
  const likedPhotoIds = useNatureStore((s) => s.likedPhotoIds);
  const savedPhotoIds = useNatureStore((s) => s.savedPhotoIds);
  const toggleLike = useNatureStore((s) => s.toggleLike);
  const toggleSave = useNatureStore((s) => s.toggleSave);

  const rankedPhotos = useMemo(() => {
    return [...photos]
      .sort((a, b) => getHonorScore(b) - getHonorScore(a))
      .slice(0, 3);
  }, [photos]);

  const topPhoto = rankedPhotos[0];
  if (!topPhoto) return null;

  const runnersUp = rankedPhotos.slice(1);
  const isLiked = likedPhotoIds.includes(topPhoto.id) || (topPhoto.is_liked_by_user ?? false);
  const isSaved = savedPhotoIds.includes(topPhoto.id) || (topPhoto.is_saved_by_user ?? false);

  return (
    <section className="py-16 sm:py-24 bg-nature-dark border-t border-nature-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
              <Crown className="w-4 h-4 text-nature-accent" />
              <span>Live Community Honor</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                REALTIME
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
              Hall of Honor
            </h2>
            <p className="mt-2 text-sm text-nature-textMuted max-w-xl">
              Automatically awarded in real time to the highest-scoring photograph across all collections, ranked by live likes and view counts.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-medium text-nature-accent hover:text-nature-accentHover flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Explore Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* #1 Honored Photograph Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center rounded-3xl bg-nature-surface border border-nature-border p-5 sm:p-8 shadow-sm">
          <div
            onClick={() => onPhotoClick?.(topPhoto)}
            className="lg:col-span-7 relative group rounded-2xl overflow-hidden bg-nature-elevated cursor-pointer aspect-[16/10]"
          >
            <img
              src={topPhoto.display_url}
              alt={topPhoto.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-accent text-white text-xs font-semibold shadow-md">
                <Crown className="w-3.5 h-3.5" />
                #1 Honored Work
              </span>
              {topPhoto.category?.name && (
                <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium border border-white/15">
                  {topPhoto.category.name}
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-nature-accent">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Honor Score: {formatCompactNumber(getHonorScore(topPhoto))}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-nature-parchment leading-snug">
                {topPhoto.title}
              </h3>

              {topPhoto.description && (
                <p className="text-sm text-nature-textMuted leading-relaxed line-clamp-3">
                  {topPhoto.description}
                </p>
              )}

              {topPhoto.author && (
                <Link
                  to={`/@${topPhoto.author.username}`}
                  className="inline-flex items-center gap-3 pt-2 group/author"
                >
                  <Avatar
                    src={topPhoto.author.avatar_url}
                    alt={topPhoto.author.full_name}
                    size="md"
                    isVerified={topPhoto.author.is_verified}
                  />
                  <div>
                    <p className="text-sm font-semibold text-nature-parchment group-hover/author:text-nature-accent transition-colors">
                      {topPhoto.author.full_name}
                    </p>
                    <p className="text-xs text-nature-textSubtle font-mono">
                      @{topPhoto.author.username}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-nature-elevated/70 border border-nature-border">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-nature-textSubtle block">
                  Live Likes
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-lg font-mono font-semibold text-nature-parchment">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  {formatCompactNumber(topPhoto.likes_count)}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-nature-textSubtle block">
                  Total Views
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-lg font-mono font-semibold text-nature-parchment">
                  <Eye className="w-4 h-4 text-nature-accent" />
                  {formatCompactNumber(topPhoto.views_count)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const next = toggleLike(topPhoto.id);
                  showToast(next ? 'Liked honored photograph' : 'Removed like', 'info');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                  isLiked
                    ? 'bg-red-500/15 text-red-500 border-red-500/30'
                    : 'bg-nature-elevated text-nature-textMuted border-nature-border hover:text-nature-parchment'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = toggleSave(topPhoto.id);
                  showToast(next ? 'Saved to collection' : 'Removed from collection', 'info');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                  isSaved
                    ? 'bg-nature-accent/15 text-nature-accent border-nature-accent/30'
                    : 'bg-nature-elevated text-nature-textMuted border-nature-border hover:text-nature-parchment'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <Link to={`/photo/${topPhoto.id}`} className="ml-auto">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Runners-Up (#2 & #3) */}
        {runnersUp.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runnersUp.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onPhotoClick?.(item)}
                className="group cursor-pointer flex items-center gap-4 p-3.5 rounded-2xl bg-nature-surface border border-nature-border hover:border-nature-accent/50 transition-all"
              >
                <div className="relative w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-nature-elevated">
                  <img
                    src={item.thumbnail_url || item.display_url}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono font-bold">
                    #{idx + 2}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="font-serif text-base font-medium text-nature-parchment truncate group-hover:text-nature-accent transition-colors">
                    {item.title}
                  </h4>
                  {item.author && (
                    <p className="text-xs text-nature-textMuted truncate">
                      by {item.author.full_name}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-nature-textSubtle">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      {formatCompactNumber(item.likes_count)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3 h-3 text-nature-accent" />
                      {formatCompactNumber(item.views_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
