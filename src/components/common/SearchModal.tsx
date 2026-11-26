import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Compass,
  User,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { Photo, Category, Profile } from '@/types';
import { Avatar } from './Avatar';
import { useNatureStore } from '@/store/useNatureStore';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto?: (photo: Photo) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const photos = useNatureStore((s) => s.photos);
  const profiles = useNatureStore((s) => s.profiles);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search logic
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        photos: photos.slice(0, 4),
        categories: DEMO_CATEGORIES.slice(0, 3),
        profiles: profiles.slice(0, 2),
      };
    }

    const matchedPhotos = photos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location_name?.toLowerCase().includes(q) ||
        p.country?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.exif.camera_model?.toLowerCase().includes(q)
    );

    const matchedCategories = DEMO_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );

    const matchedProfiles = profiles.filter(
      (pr) =>
        pr.full_name.toLowerCase().includes(q) ||
        pr.username.toLowerCase().includes(q) ||
        pr.location?.toLowerCase().includes(q)
    );

    return {
      photos: matchedPhotos.slice(0, 5),
      categories: matchedCategories.slice(0, 3),
      profiles: matchedProfiles.slice(0, 3),
    };
  }, [query, photos, profiles]);

  // Flattened items for keyboard arrow navigation
  const flatItems = useMemo(() => {
    const items: Array<{
      type: 'photo' | 'category' | 'profile';
      item: Photo | Category | Profile;
    }> = [];
    results.photos.forEach((p) => items.push({ type: 'photo', item: p }));
    results.categories.forEach((c) => items.push({ type: 'category', item: c }));
    results.profiles.forEach((pr) => items.push({ type: 'profile', item: pr }));
    return items;
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = flatItems[selectedIndex];
      if (current) {
        handleSelectItem(current.type, current.item);
      }
    }
  };

  const handleSelectItem = (type: 'photo' | 'category' | 'profile', item: Photo | Category | Profile) => {
    onClose();
    if (type === 'photo') {
      const photo = item as Photo;
      if (onSelectPhoto) {
        onSelectPhoto(photo);
      } else {
        navigate(`/photo/${photo.id}`);
      }
    } else if (type === 'category') {
      const category = item as Category;
      navigate(`/category/${category.slug}`);
    } else if (type === 'profile') {
      const profile = item as Profile;
      navigate(`/@${profile.username}`);
    }
  };

  const quickPills = ['Dolomites', 'Aurora', 'Redwood', 'Wildlife', 'Arctic', 'Fuji'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
        {/* Backdrop Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-nature-dark/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white border border-nature-border shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Search Input Bar */}
          <div className="relative flex items-center px-5 py-4 border-b border-nature-border bg-nature-elevated/50">
            <Search className="w-5 h-5 text-nature-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search photographs, biomes, photographers, camera gear..."
              className="w-full pl-3.5 pr-8 bg-transparent text-sm sm:text-base text-nature-parchment placeholder-nature-textSubtle focus:outline-none font-sans"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-nature-textMuted hover:text-nature-parchment transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-nature-textMuted bg-nature-elevated border border-nature-border">
                ESC
              </kbd>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-5 py-2.5 bg-nature-dark border-b border-nature-border flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] text-nature-textSubtle font-mono uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-nature-accent" />
              Popular:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setQuery(pill)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-nature-accent/15 border border-nature-border hover:border-nature-accent/50 text-[11px] text-nature-parchment transition-all whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Search Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Photographs Section */}
            {results.photos.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-nature-accent flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Photographs ({results.photos.length})</span>
                </div>
                {results.photos.map((photo) => {
                  const itemIndex = flatItems.findIndex((it) => it.type === 'photo' && (it.item as Photo).id === photo.id);
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <div
                      key={photo.id}
                      onClick={() => handleSelectItem('photo', photo)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-nature-accent/15 border border-nature-accent/40 shadow-sm'
                          : 'hover:bg-nature-dark/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 16:10 Thumbnail */}
                        <div className="w-14 h-9 rounded-lg overflow-hidden shrink-0 bg-nature-dark border border-nature-border relative">
                          <img
                            src={photo.thumbnail_url || photo.display_url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-nature-parchment truncate font-sans">
                            {photo.title}
                          </h4>
                          <p className="text-[11px] text-nature-textMuted truncate font-mono">
                            {photo.location_name || photo.country} • {photo.category?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-nature-accent bg-nature-dark/60 px-2 py-0.5 rounded-full border border-nature-border">
                          {photo.exif.camera_model?.split(' ')[0] || 'RAW'}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-nature-accent translate-x-0.5' : 'text-nature-textSubtle'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Categories Section */}
            {results.categories.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-nature-border/40">
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-nature-accent flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Biomes & Categories</span>
                </div>
                {results.categories.map((cat) => {
                  const itemIndex = flatItems.findIndex((it) => it.type === 'category' && (it.item as Category).id === cat.id);
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectItem('category', cat)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-nature-accent/15 border border-nature-accent/40 shadow-sm'
                          : 'hover:bg-nature-dark/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-nature-dark border border-nature-border">
                          <img
                            src={cat.cover_image_url}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-nature-parchment">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-nature-textMuted line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-nature-textSubtle shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Photographers Section */}
            {results.profiles.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-nature-border/40">
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-nature-accent flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Photographers</span>
                </div>
                {results.profiles.map((profile) => {
                  const itemIndex = flatItems.findIndex((it) => it.type === 'profile' && (it.item as Profile).id === profile.id);
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <div
                      key={profile.id}
                      onClick={() => handleSelectItem('profile', profile)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-nature-accent/15 border border-nature-accent/40 shadow-sm'
                          : 'hover:bg-nature-dark/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          size="sm"
                          isVerified={profile.is_verified}
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-nature-parchment">
                            {profile.full_name}
                          </h4>
                          <p className="text-[11px] text-nature-textMuted font-mono">
                            @{profile.username} • {profile.location}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-nature-textSubtle shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}

            {flatItems.length === 0 && (
              <div className="py-12 text-center space-y-2">
                <p className="font-serif text-lg text-nature-parchment">No results found</p>
                <p className="text-xs text-nature-textMuted">
                  We could not find any photographs or categories matching "{query}".
                </p>
              </div>
            )}
          </div>

          {/* Footer Keyboard Hints */}
          <div className="px-5 py-3 border-t border-nature-border bg-nature-elevated flex items-center justify-between text-[11px] text-nature-textSubtle font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-nature-border text-nature-parchment">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-nature-border text-nature-parchment">↵</kbd>
                <span>Open</span>
              </span>
            </div>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-nature-border text-nature-parchment">Esc</kbd> to exit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
