import React from 'react';
import { SlidersHorizontal, Sparkles, ShieldCheck, Camera } from 'lucide-react';
import { ImageComparisonSlider } from '@/components/gallery/ImageComparisonSlider';

export const MasteryComparisonSection: React.FC = () => {
  return (
    <section className="py-24 bg-nature-dark border-t border-nature-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Narrative Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Sensory Fidelity & Mastery</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-nature-parchment leading-tight">
              Honoring Natural Light, Not Fabricating It.
            </h2>

            <p className="text-base text-nature-textMuted leading-relaxed">
              Drag the interactive divider to inspect the nuanced art of field post-processing. At NatureLens, post-processing is used to recover raw sensor dynamic range and reveal what the human eye perceived—never to synthesize artificial elements or mislead viewers.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-nature-parchment/90">
                <Camera className="w-4 h-4 text-nature-accent shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">RAW Uncompressed Standard:</strong> High bit-depth captures retain shadow detail and delicate highlights without clipping.
                </p>
              </div>
              <div className="flex items-start gap-3 text-xs text-nature-parchment/90">
                <Sparkles className="w-4 h-4 text-nature-accent shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Editorial Color Grading:</strong> Calibrated against natural tonal curves to honor true habitat atmospheres.
                </p>
              </div>
              <div className="flex items-start gap-3 text-xs text-nature-parchment/90">
                <ShieldCheck className="w-4 h-4 text-nature-accent shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Zero Synthetic Replacements:</strong> No AI-generated skies, false animals, or fraudulent composite artifacts.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Comparison Slider Right */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full aspect-[16/10] max-h-[500px]">
              <ImageComparisonSlider
                beforeImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=50"
                afterImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=90"
                beforeLabel="Linear RAW Flat Profile"
                afterLabel="Fine-Art Tonal Master"
                altBefore="Flat unedited RAW capture"
                altAfter="Master fine-art landscape grade"
                className="h-full w-full"
              />
            </div>
            <p className="text-xs text-nature-textSubtle mt-3 font-mono">
              ↔ Drag or swipe the center divider to compare sensor exposure vs final master grade
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
