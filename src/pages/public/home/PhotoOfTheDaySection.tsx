import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Camera, Heart, Bookmark, Eye, ArrowRight } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Lens } from '@/components/gallery/Lens';
import { formatCompactNumber } from '@/lib/utils';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';

export const PhotoOfTheDaySection: React.FC = () => {
  const { showToast } = useToast();
  const photos = useNatureStore((s) => s.photos);
  const likedPhotoIds = useNatureStore((s) => s.likedPhotoIds);
  const savedPhotoIds = useNatureStore((s) => s.savedPhotoIds);
  const toggleLike = useNatureStore((s) => s.toggleLike);
  const toggleSave = useNatureStore((s) => s.toggleSave);

  const photo = photos[0];
  if (!photo) return null;

  const isLiked = likedPhotoIds.includes(photo.id) || (photo.is_liked_by_user ?? false);
  const isSaved = savedPhotoIds.includes(photo.id) || (photo.is_saved_by_user ?? false);

  return (
    <section className="py-20 bg-nature-surface border-y border-nature-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
              <Award className="w-4 h-4" />
              <span>Daily Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
              Photo of the Day
            </h2>
          </div>
          <p className="text-sm text-nature-textMuted max-w-md">
            Selected every day for striking light, composition, and ethical field craft.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-nature-dark border border-nature-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden shadow-md">
            <Lens zoomFactor={2.2} lensSize={200} showControls={true}>
              <img
                src={photo.display_url}
                alt={photo.title}
                className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700"
              />
            </Lens>
          </div>

          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-nature-surface text-nature-accent border border-nature-border shadow-sm">
                {photo.category?.name}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-nature-parchment leading-snug">
                <Link to={`/photo/${photo.id}`} className="hover:text-nature-accent transition-colors">
                  {photo.title}
                </Link>
              </h3>

              <p className="text-sm text-nature-textMuted leading-relaxed">
                "{photo.description}"
              </p>

              {photo.author && (
                <Link to={`/@${photo.author.username}`} className="flex items-center gap-3 pt-2 group">
                  <Avatar
                    src={photo.author.avatar_url}
                    alt={photo.author.full_name}
                    size="md"
                    isVerified={photo.author.is_verified}
                  />
                  <div>
                    <p className="text-sm font-medium text-nature-parchment group-hover:text-nature-accent transition-colors">
                      {photo.author.full_name}
                    </p>
                    <p className="text-xs text-nature-textMuted">
                      {photo.author.location}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            <div className="bg-nature-surface rounded-2xl p-4 border border-nature-border shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-nature-accent mb-3">
                <Camera className="w-3.5 h-3.5" />
                <span>Camera & Settings</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-nature-textSubtle block text-[10px]">CAMERA</span>
                  <span className="text-nature-parchment truncate block">{photo.exif.camera_model}</span>
                </div>
                <div>
                  <span className="text-nature-textSubtle block text-[10px]">LENS</span>
                  <span className="text-nature-parchment truncate block">{photo.exif.lens}</span>
                </div>
                <div>
                  <span className="text-nature-textSubtle block text-[10px]">APERTURE</span>
                  <span className="text-nature-parchment block">{photo.exif.aperture}</span>
                </div>
                <div>
                  <span className="text-nature-textSubtle block text-[10px]">SHUTTER</span>
                  <span className="text-nature-parchment block">{photo.exif.shutter_speed}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-nature-textMuted">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-nature-accent" />
                  {formatCompactNumber(photo.views_count)} views
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = toggleLike(photo.id);
                    showToast(next ? 'Added to liked photographs' : 'Removed from liked', 'info');
                  }}
                  className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-red-400'}`} />
                  {formatCompactNumber(photo.likes_count)} likes
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isSaved ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    const next = toggleSave(photo.id);
                    showToast(next ? 'Saved to your collection' : 'Removed from collection', 'info');
                  }}
                  leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Link to={`/photo/${photo.id}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Read Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
