import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { WallpaperGridCard } from '@/components/gallery/WallpaperGridCard';
import { Photo } from '@/types';
import { useNatureStore } from '@/store/useNatureStore';

export interface EditorsSelectionSectionProps {
  onPhotoClick?: (photo: Photo) => void;
}

export const EditorsSelectionSection: React.FC<EditorsSelectionSectionProps> = ({ onPhotoClick }) => {
  const photos = useNatureStore((s) => s.photos);
  const editorsPhotos = photos.filter((p) => p.is_editor_choice).slice(0, 8);

  const handleCardClick = (photo: Photo) => {
    if (onPhotoClick) {
      onPhotoClick(photo);
    }
  };

  return (
    <section className="py-24 bg-nature-surface border-t border-nature-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Editor's Picks</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
              Editor’s Choice
            </h2>
            <p className="mt-2 text-sm text-nature-textMuted max-w-xl">
              Standout photographs selected by our curators for perspective, tone, and technical craft.
            </p>
          </div>
          <Link
            to="/explore?filter=editors-choice"
            className="text-sm font-medium text-nature-accent hover:text-nature-accentHover flex items-center gap-1.5 transition-colors"
          >
            <span>View All Editor's Picks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorsPhotos.map((photo, index) => (
            <WallpaperGridCard
              key={photo.id}
              photo={photo}
              onClick={handleCardClick}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
