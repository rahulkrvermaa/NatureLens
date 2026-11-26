import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Search, Sparkles, Flame, Clock, Grid, LayoutGrid } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { WallpaperGridCard } from '@/components/gallery/WallpaperGridCard';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { Badge } from '@/components/common/Badge';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { Photo } from '@/types';
import { useNatureStore } from '@/store/useNatureStore';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter');
  const initialTag = searchParams.get('tag') || '';

  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'editors-choice'>(
    initialFilter === 'editors-choice'
      ? 'editors-choice'
      : initialFilter === 'latest'
      ? 'latest'
      : 'trending'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialTag);
  const [viewMode, setViewMode] = useState<'wallpaper' | 'masonry'>('wallpaper');

  const photos = useNatureStore((s) => s.photos);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    if (initialFilter === 'editors-choice') setActiveTab('editors-choice');
    else if (initialFilter === 'trending') setActiveTab('trending');
    else if (initialFilter === 'latest') setActiveTab('latest');
  }, [initialFilter]);

  useEffect(() => {
    setSearchQuery(initialTag);
  }, [initialTag]);

  const filteredPhotos = useMemo(() => {
    const filtered = photos.filter((photo) => {
      if (selectedCategory !== 'all' && photo.category?.slug !== selectedCategory) {
        return false;
      }
      if (activeTab === 'editors-choice' && !photo.is_editor_choice) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = photo.title.toLowerCase().includes(query);
        const matchesCategory = photo.category?.name.toLowerCase().includes(query);
        const matchesAuthor = photo.author?.full_name.toLowerCase().includes(query);
        const matchesLocation = photo.location_name?.toLowerCase().includes(query);
        const matchesTags = photo.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesCamera = photo.exif.camera_model?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesAuthor && !matchesLocation && !matchesTags && !matchesCamera) {
          return false;
        }
      }
      return true;
    });

    if (activeTab === 'trending') {
      return [...filtered].sort(
        (a, b) => b.likes_count + b.views_count - (a.likes_count + a.views_count)
      );
    }
    if (activeTab === 'latest') {
      return [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return filtered;
  }, [photos, activeTab, selectedCategory, searchQuery]);

  const handleCardClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsDownloadModalOpen(true);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-nature-border">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
            <Compass className="w-4 h-4" />
            <span>Gallery</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-nature-parchment">
            Explore Photography
          </h1>
          <p className="mt-2 text-sm text-nature-textMuted max-w-xl">
            Discover wildlife, landscapes, and macro captures from around the world. Click any photo to inspect camera settings or download.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nature-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Search species, location, camera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-nature-surface border border-nature-border text-sm text-nature-parchment placeholder-nature-textSubtle focus:outline-none focus:border-nature-accent focus:ring-1 focus:ring-nature-accent"
          />
        </div>
      </div>

      {/* Control Bar: Tabs & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-nature-elevated p-1 rounded-full border border-nature-border w-fit">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'trending'
                ? 'bg-nature-accent text-white font-semibold shadow-sm'
                : 'text-nature-textMuted hover:text-nature-parchment'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'latest'
                ? 'bg-nature-accent text-white font-semibold shadow-sm'
                : 'text-nature-textMuted hover:text-nature-parchment'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Latest
          </button>
          <button
            onClick={() => setActiveTab('editors-choice')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'editors-choice'
                ? 'bg-nature-accent text-white font-semibold shadow-sm'
                : 'text-nature-textMuted hover:text-nature-parchment'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Editor's Choice
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-nature-elevated p-1 rounded-full border border-nature-border">
            <button
              onClick={() => setViewMode('wallpaper')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'wallpaper'
                  ? 'bg-nature-accent text-white'
                  : 'text-nature-textMuted hover:text-nature-parchment'
              }`}
              title="Uniform 16:10 Grid View"
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

          <Badge variant="subtle" size="sm">
            {filteredPhotos.length} photographs
          </Badge>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
            selectedCategory === 'all'
              ? 'bg-nature-accent text-white border-nature-accent font-semibold'
              : 'bg-nature-surface text-nature-textMuted border-nature-border hover:text-nature-parchment'
          }`}
        >
          All Biomes
        </button>
        {DEMO_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === cat.slug
                ? 'bg-nature-accent text-white border-nature-accent font-semibold'
                : 'bg-nature-surface text-nature-textMuted border-nature-border hover:text-nature-parchment'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Gallery Grid or Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-nature-surface border border-nature-border space-y-3">
          <p className="font-serif text-xl text-nature-parchment">No matching photographs found</p>
          <p className="text-xs text-nature-textMuted">Try clearing your search filter or selecting another biome.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setActiveTab('trending');
            }}
            className="text-xs font-semibold text-nature-accent hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === 'wallpaper' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredPhotos.map((photo, index) => (
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
          photos={filteredPhotos}
          priorityCount={4}
          onOpenLightbox={handleCardClick}
        />
      )}

      <PhotoDownloadModal
        photo={selectedPhoto}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
