import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, LayoutGrid, Grid } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { WallpaperGridCard } from '@/components/gallery/WallpaperGridCard';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { Photo } from '@/types';
import { useNatureStore } from '@/store/useNatureStore';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const allPhotos = useNatureStore((s) => s.photos);
  const category = DEMO_CATEGORIES.find((c) => c.slug === slug);
  const photos = allPhotos.filter((p) => p.category?.slug === slug);

  const [viewMode, setViewMode] = useState<'wallpaper' | 'masonry'>('wallpaper');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-medium text-nature-parchment">
          Category Not Found
        </h2>
        <p className="mt-2 text-sm text-nature-textMuted">
          The requested biome category could not be located in our registry.
        </p>
        <Link
          to="/categories"
          className="mt-6 inline-flex items-center gap-2 text-nature-accent hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Back link */}
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-nature-textMuted hover:text-nature-accent transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
      </Link>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-nature-border h-72 sm:h-80 flex items-end p-8 sm:p-12 shadow-sm">
        <img
          src={category.cover_image_url}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/20">
            <Layers className="w-3.5 h-3.5 text-nature-accent" />
            <span>{photos.length} {photos.length === 1 ? 'photograph' : 'photographs'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-white">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-200">
            {category.description}
          </p>
        </div>
      </div>

      {/* Photos Stream */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-nature-border pb-4">
          <h2 className="font-serif text-2xl font-medium text-nature-parchment">
            Published Works ({photos.length})
          </h2>

          {/* View toggle */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
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
            photos={photos}
            priorityCount={3}
            onOpenLightbox={handleCardClick}
          />
        )}
      </div>

      {/* Photo Download & Details Modal */}
      <PhotoDownloadModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
