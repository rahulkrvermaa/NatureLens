import React from 'react';
import { Photo } from '@/types';
import { PhotoCard } from './PhotoCard';

export interface MasonryGridProps {
  photos: Photo[];
  priorityCount?: number;
  onOpenLightbox?: (photo: Photo) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  photos,
  priorityCount = 3,
  onOpenLightbox,
}) => {
  if (photos.length === 0) {
    return (
      <div className="w-full py-20 text-center rounded-2xl bg-nature-moss/40 border border-nature-border">
        <p className="text-nature-textMuted text-base font-serif">
          No photographs found in this view.
        </p>
      </div>
    );
  }

  return (
    <div className="masonry-grid w-full">
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          priority={index < priorityCount}
          onOpenLightbox={onOpenLightbox}
        />
      ))}
    </div>
  );
};
