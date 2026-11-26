import React from 'react';
import { Sun, Compass } from 'lucide-react';
import MorphGallery from '@/components/ui/morph-gallery';
import { NATURE_MORPH_ITEMS } from '@/components/ui/morph-gallery-utils';

export const MorphShowcaseSection: React.FC = () => {
  return (
    <section className="py-20 bg-nature-surface border-y border-nature-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Clean, easy-to-read Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-nature-accent">
              <Sun className="w-3.5 h-3.5" />
              <span>Light &amp; Time</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment leading-tight">
              Light Across the Seasons
            </h2>
            <p className="text-sm sm:text-base text-nature-textMuted leading-relaxed">
              See how natural light changes from bright afternoon fields and golden sunset to blue hour and quiet night.
            </p>
          </div>

          <span className="text-xs font-mono text-nature-textSubtle">
            {NATURE_MORPH_ITEMS.length} Field Photos · Shot by Rahul
          </span>
        </div>

        {/* Morph Gallery */}
        <div className="relative rounded-2xl overflow-hidden border border-nature-border shadow-md bg-black">
          <MorphGallery
            items={NATURE_MORPH_ITEMS}
            height="clamp(360px, 60vh, 620px)"
            autoplay={5000}
            duration={1600}
            noiseScale={3.5}
            edge={0.16}
            drift={0.4}
            className="rounded-2xl"
          />
        </div>

        {/* Simple Instructions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-nature-textMuted px-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-nature-accent" />
            <span>Click any thumbnail or use the arrows to switch photos.</span>
          </div>
          <span className="text-nature-textSubtle">Auto-plays every 5 seconds</span>
        </div>
      </div>
    </section>
  );
};
