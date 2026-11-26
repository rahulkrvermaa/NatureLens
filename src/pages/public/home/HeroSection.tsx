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
    ...FOG_OVERLAY_LAYERS.slice(0, 2).map((fog, i) => ({
      ...fog,
      zIndex: 12 + i,
      className: 'opacity-35 hidden sm:block',
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
        {/* Desktop Side Arrows (hidden on mobile so they never overlap text) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous hero scene"
          className="hidden sm:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next hero scene"
          className="hidden sm:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Actions & Mobile-Friendly Slide Controls */}
        <div className="absolute bottom-5 sm:bottom-8 inset-x-0 z-20 flex flex-col items-center gap-4 px-4">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white text-stone-950 hover:bg-stone-100 text-xs font-semibold uppercase tracking-widest shadow-lg transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-black/70 text-white border border-white/25 hover:bg-black/85 text-xs font-semibold uppercase tracking-widest shadow-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Work</span>
            </Link>
          </div>

          {/* Slide Dots + Mobile Prev/Next */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="sm:hidden p-1.5 rounded-full bg-black/60 text-white border border-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Switch to ${slide.title} scene`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="sm:hidden p-1.5 rounded-full bg-black/60 text-white border border-white/20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ParallaxHero>
    </div>
  );
};
