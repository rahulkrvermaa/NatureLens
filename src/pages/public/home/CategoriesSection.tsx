import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { useNatureStore } from '@/store/useNatureStore';

export const CategoriesSection: React.FC = () => {
  const photos = useNatureStore((s) => s.photos);

  return (
    <section className="py-24 bg-nature-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
              Explore by Biome
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-sm font-medium text-nature-accent hover:text-nature-accentHover flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEMO_CATEGORIES.slice(0, 8).map((category) => {
            const liveCount = photos.filter(
              (p) => p.category_id === category.id || p.category?.slug === category.slug
            ).length;

            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-nature-surface border border-nature-border shadow-sm transition-all duration-300 hover:border-nature-accent hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={category.cover_image_url}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-95" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
                    {liveCount} {liveCount === 1 ? 'photograph' : 'photographs'}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-white group-hover:text-amber-200 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
