import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { usePageMeta } from '@/lib/seo';

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'NatureLens — Capture the Beauty. Share the World.',
    description:
      'A world of extraordinary moments, captured by nature photographers everywhere. Explore landscapes, wildlife, oceans, and astronomical photography.',
  },
  '/explore': {
    title: 'Explore Nature Photography — NatureLens',
    description: 'Browse curated wildlife, landscape, ocean, macro, and astrophotography from creators worldwide.',
  },
  '/categories': {
    title: 'Photography Biomes & Categories — NatureLens',
    description: 'Discover curated nature photography collections organized by biome and photographic discipline.',
  },
  '/challenges': {
    title: 'Field Challenges & Missions — NatureLens',
    description: 'Join ethical wildlife and landscape photography challenges on NatureLens.',
  },
  '/upload': {
    title: 'Share Your Photo — NatureLens',
    description: 'Publish high-resolution nature photography with full EXIF camera telemetry on NatureLens.',
  },
  '/login': {
    title: 'Sign In — NatureLens',
    description: 'Sign in to your NatureLens photographer account.',
  },
  '/signup': {
    title: 'Create Account — NatureLens',
    description: 'Join NatureLens to share nature photography, save collections, and download master resolution images.',
  },
};

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  const routeMeta = ROUTE_META[pathname];

  usePageMeta({
    title: routeMeta?.title ?? 'NatureLens — Capture the Beauty. Share the World.',
    description: routeMeta?.description,
    canonicalPath: pathname,
    enabled: Boolean(routeMeta),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-nature-dark text-nature-parchment selection:bg-nature-accent selection:text-nature-dark">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
