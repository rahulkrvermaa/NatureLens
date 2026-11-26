import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { useNatureStore } from '@/store/useNatureStore';

export const CategoriesPage: React.FC = () => {
  const photos = useNatureStore((s) => s.photos);

  return (
    <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
          <Layers className="w-4 h-4" />
          <span>Ecosystems &amp; Biomes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-nature-parchment">
          Explore Categories
        </h1>
        <p className="mt-3 text-base text-nature-textMuted leading-relaxed">
          Browse photographs organized by habitat and natural discipline—from polar ice and ocean depths to mountain peaks and desert dunes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {DEMO_CATEGORIES.map((category) => {
          const liveCount = photos.filter(
            (p) => p.category_id === category.id || p.category?.slug === category.slug
          ).length;

          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-nature-surface border border-nature-border shadow-sm transition-all duration-300 hover:border-nature-accent hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={category.cover_image_url}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-white">
                  {liveCount} {liveCount === 1 ? 'work' : 'works'}
                </div>
              </div>

              <div className="p-6 space-y-3 -mt-6 relative z-10 bg-nature-surface rounded-3xl">
                <h2 className="font-serif text-2xl font-medium text-nature-parchment group-hover:text-nature-accent transition-colors flex items-center justify-between">
                  <span>{category.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-nature-accent" />
                </h2>
                <p className="text-sm text-nature-textMuted leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
