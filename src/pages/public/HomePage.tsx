import React, { useState } from 'react';
import { HeroSection } from './home/HeroSection';
import { PhotoOfTheDaySection } from './home/PhotoOfTheDaySection';
import { CircularGallerySection } from './home/CircularGallerySection';
import { MorphShowcaseSection } from './home/MorphShowcaseSection';
import { CategoriesSection } from './home/CategoriesSection';
import { EditorsSelectionSection } from './home/EditorsSelectionSection';
import { TrendingSection } from './home/TrendingSection';
import { FeaturedPhotographersSection } from './home/FeaturedPhotographersSection';
import { ChallengesSection } from './home/ChallengesSection';
import { EthicsManifestoSection } from './home/EthicsManifestoSection';
import { DeveloperSection } from './home/DeveloperSection';
import { LightboxModal } from '@/components/gallery/LightboxModal';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { Photo } from '@/types';
import { useNatureStore } from '@/store/useNatureStore';

export const HomePage: React.FC = () => {
  const photos = useNatureStore((s) => s.photos);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [downloadPhoto, setDownloadPhoto] = useState<Photo | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePhotoDownloadClick = (photo: Photo) => {
    setDownloadPhoto(photo);
    setIsDownloadModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col">
      <HeroSection onPhotoClick={handleOpenLightbox} />
      <PhotoOfTheDaySection />
      <TrendingSection onPhotoClick={handlePhotoDownloadClick} />
      <CircularGallerySection />
      <EditorsSelectionSection onPhotoClick={handlePhotoDownloadClick} />
      <MorphShowcaseSection />
      <CategoriesSection />
      <FeaturedPhotographersSection />
      <ChallengesSection />
      <EthicsManifestoSection />
      <DeveloperSection />

      <LightboxModal
        photos={photos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <PhotoDownloadModal
        photo={downloadPhoto}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
