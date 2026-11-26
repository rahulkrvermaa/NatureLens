import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Heart,
  Bookmark,
  Share2,
  Info,
  Maximize2,
  Minimize2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Photo } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { Lens } from './Lens';
import { formatCompactNumber, formatEditorialDate } from '@/lib/utils';

export interface LightboxModalProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photos,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [useLens, setUseLens] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'i') setShowInfo((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-nature-dark/95 backdrop-blur-xl flex flex-col justify-between"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 z-20 border-b border-nature-border/40">
          <div className="flex items-center gap-3">
            {currentPhoto.author && (
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={currentPhoto.author.avatar_url}
                  alt={currentPhoto.author.full_name}
                  size="sm"
                  isVerified={currentPhoto.author.is_verified}
                />
                <div>
                  <p className="text-xs font-semibold text-nature-parchment leading-tight">
                    {currentPhoto.author.full_name}
                  </p>
                  <p className="text-[10px] text-nature-textMuted font-mono">
                    {currentIndex + 1} of {photos.length}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle Macro Lens */}
            <button
              onClick={() => setUseLens(!useLens)}
              className={`p-2 rounded-full border text-xs flex items-center gap-1.5 transition-all ${
                useLens
                  ? 'bg-nature-accent text-white border-nature-accent font-semibold shadow-sm'
                  : 'bg-white/80 text-nature-textMuted border-nature-border hover:text-nature-parchment'
              }`}
              title="Toggle interactive lens inspection"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Macro Lens</span>
            </button>

            {/* Toggle Zoom */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-full bg-white/80 border border-nature-border text-nature-textMuted hover:text-nature-parchment transition-colors"
              title="Toggle Zoom"
            >
              {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Toggle Info Drawer */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full border transition-colors ${
                showInfo
                  ? 'bg-nature-accent text-white border-nature-accent'
                  : 'bg-white/80 border-nature-border text-nature-textMuted hover:text-nature-parchment'
              }`}
              title="Toggle Photo & EXIF Details (Press I)"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white border border-nature-border text-nature-parchment hover:bg-nature-elevated transition-colors ml-2"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Stage: Photo Display & Nav Buttons */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-3 rounded-full bg-white/90 border border-nature-border text-nature-parchment hover:bg-nature-accent hover:text-white transition-all shadow-md backdrop-blur-md"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Photo Container */}
          <div className="relative max-h-full max-w-full flex items-center justify-center">
            {useLens ? (
              <Lens zoomFactor={2.5} lensSize={200} showControls={false}>
                <img
                  src={currentPhoto.display_url}
                  alt={currentPhoto.title}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              </Lens>
            ) : (
              <img
                src={currentPhoto.display_url}
                alt={currentPhoto.title}
                className={`max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            )}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-3 rounded-full bg-white/90 border border-nature-border text-nature-parchment hover:bg-nature-accent hover:text-white transition-all shadow-md backdrop-blur-md"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Bar: Title, Like/Save & Quick Specs */}
        <div className="p-4 sm:p-6 z-20 border-t border-nature-border bg-white/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono text-nature-accent uppercase tracking-wider">
              {currentPhoto.category?.name}
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-medium text-nature-parchment">
              {currentPhoto.title}
            </h2>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nature-elevated border border-nature-border text-xs text-nature-textMuted hover:text-red-500 transition-colors">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>{formatCompactNumber(currentPhoto.likes_count)}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nature-elevated border border-nature-border text-xs text-nature-textMuted hover:text-nature-accent transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button className="p-2 rounded-full bg-nature-elevated border border-nature-border text-nature-textMuted hover:text-nature-parchment transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slide-out EXIF & Story Drawer */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white/95 backdrop-blur-2xl border-l border-nature-border p-6 z-30 overflow-y-auto space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-nature-border">
                <h3 className="font-serif text-lg font-medium text-nature-parchment">
                  Photograph Metadata
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 rounded-full text-nature-textMuted hover:text-nature-parchment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {currentPhoto.description && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-nature-textMuted">
                    Artist Statement
                  </span>
                  <p className="text-xs text-nature-parchment/90 leading-relaxed font-light">
                    "{currentPhoto.description}"
                  </p>
                </div>
              )}

              {/* EXIF Grid */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-nature-accent flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Technical EXIF Readout
                </span>
                <div className="bg-nature-dark/80 rounded-xl p-3 border border-nature-border/60 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-nature-textMuted font-sans">Camera</span>
                    <span className="text-nature-parchment">{currentPhoto.exif.camera_model || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nature-textMuted font-sans">Lens</span>
                    <span className="text-nature-parchment truncate max-w-[170px]">{currentPhoto.exif.lens || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nature-textMuted font-sans">Focal Length</span>
                    <span className="text-nature-parchment">{currentPhoto.exif.focal_length || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nature-textMuted font-sans">Aperture</span>
                    <span className="text-nature-parchment">{currentPhoto.exif.aperture || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nature-textMuted font-sans">Shutter</span>
                    <span className="text-nature-parchment">{currentPhoto.exif.shutter_speed || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nature-textMuted font-sans">ISO</span>
                    <span className="text-nature-parchment">{currentPhoto.exif.iso || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {currentPhoto.location_name && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-nature-textMuted">
                    Sanitized Location
                  </span>
                  <p className="text-xs text-nature-parchment flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-nature-accent" />
                    {currentPhoto.location_name}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-nature-border/40 text-[11px] text-nature-textSubtle flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>Captured {formatEditorialDate(currentPhoto.created_at)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
