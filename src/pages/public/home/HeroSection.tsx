import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { ParallaxHero } from '@/components/ui/wilderness';
import { defaultLayers, type ParallaxLayer } from '@/components/ui/wilderness-layers';
import { useNatureStore } from '@/store/useNatureStore';

export interface HeroSectionProps {
  onPhotoClick?: (index: number) => void;
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  skyClassName: string;
  layers: ParallaxLayer[];
}

const FOG_OVERLAY_LAYERS = defaultLayers.filter((l) => l.alt.startsWith('fog-'));

function buildBackdropSlideLayers(imageUrl: string, alt: string): ParallaxLayer[] {
  return [
    {
      src: imageUrl,
      alt,
      speedX: 0.035,
      speedY: 0.035,
      speedZ: 0,
      rotation: 0.03,
      distance: 0,
      zIndex: 1,
      initialTop: '50%',
      initialLeft: '50%',
      width: '115%',
      className: 'h-[115%] object-cover brightness-75',
    },
    ...FOG_OVERLAY_LAYERS.slice(0, 3).map((fog, i) => ({
      ...fog,
      zIndex: 12 + i,
      className: 'opacity-40',
    })),
  ];
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const photos = useNatureStore((s) => s.photos);
  const activePhotographers = useNatureStore((s) => s.activePhotographers);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: HeroSlide[] = useMemo(() => {
    const livePhotoSlides: HeroSlide[] = photos
      .filter((photo) => photo.id !== 'ph-3')
      .slice(0, 4)
      .map((photo) => ({
        id: photo.id,
        title: (photo.category?.name || 'WILDERNESS').toUpperCase(),
        subtitle: `${photo.title} · ${photo.location_name || photo.country || 'Field Archive'}`,
        skyClassName: 'bg-[#08100b]',
        layers: buildBackdropSlideLayers(photo.display_url, photo.title),
      }));

    return [
      {
        id: 'wilderness-3d',
        title: 'NATURELENS',
        subtitle: `${activePhotographers} Photographers Live · ${photos.length} Curated Works`,
        skyClassName: 'bg-gradient-to-b from-[#08121a] via-[#13293d] to-[#1b3a4b]',
        layers: defaultLayers,
      },
      ...livePhotoSlides,
    ];
  }, [photos, activePhotographers]);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const current = slides[activeSlide] || slides[0];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <ParallaxHero
        key={current.id}
        layers={current.layers}
        title={current.title}
        subtitle={current.subtitle}
        skyClassName={current.skyClassName}
      >
        {/* Left & Right Slide Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous hero scene"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[120] p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next hero scene"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[120] p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Actions & Slide Dots */}
        <div className="absolute bottom-8 inset-x-0 z-[120] flex flex-col items-center gap-5 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-stone-950 hover:bg-stone-100 text-xs font-semibold uppercase tracking-widest shadow-xl transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black/55 backdrop-blur-md text-white border border-white/25 hover:bg-black/75 text-xs font-semibold uppercase tracking-widest shadow-xl transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Work</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Switch to ${slide.title} scene`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </ParallaxHero>
    </div>
  );
};
