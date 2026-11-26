import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Heart,
  Bookmark,
  Share2,
  Camera,
  MapPin,
  Calendar,
  Check,
  ShieldCheck,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Photo } from '@/types';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { formatCompactNumber, formatEditorialDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useToast } from '@/context/useToast';

import { useNatureStore } from '@/store/useNatureStore';

export interface PhotoDownloadModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoDownloadModal: React.FC<PhotoDownloadModalProps> = ({
  photo,
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [selectedResolution, setSelectedResolution] = useState<'original' | '4k' | '1080p' | 'mobile'>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const photos = useNatureStore((s) => s.photos);
  const likedPhotoIds = useNatureStore((s) => s.likedPhotoIds);
  const savedPhotoIds = useNatureStore((s) => s.savedPhotoIds);
  const toggleLike = useNatureStore((s) => s.toggleLike);
  const toggleSave = useNatureStore((s) => s.toggleSave);
  const incrementView = useNatureStore((s) => s.incrementView);

  const livePhoto = photo ? photos.find((p) => p.id === photo.id) || photo : null;
  const isLiked = livePhoto ? likedPhotoIds.includes(livePhoto.id) || (livePhoto.is_liked_by_user ?? false) : false;
  const isSaved = livePhoto ? savedPhotoIds.includes(livePhoto.id) || (livePhoto.is_saved_by_user ?? false) : false;
  const likesCount = livePhoto?.likes_count ?? 0;

  useEffect(() => {
    if (isOpen && photo?.id) {
      setDownloadSuccess(false);
      incrementView(photo.id);
    }
  }, [isOpen, photo?.id, incrementView]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !photo || !livePhoto) return null;

  const handleLike = () => {
    const nextLiked = toggleLike(livePhoto.id);
    showToast(nextLiked ? 'Added to liked photographs' : 'Removed from liked photographs', 'info');
  };

  const handleSaveToggle = () => {
    const nextSaved = toggleSave(livePhoto.id);
    showToast(nextSaved ? 'Saved to your personal collection' : 'Removed from collection', 'info');
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(photo.display_url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${photo.slug || 'naturelens-photo'}-${selectedResolution}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      showToast(`Downloaded ${selectedResolution.toUpperCase()} master image!`, 'success');
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      window.open(photo.display_url, '_blank');
      showToast('Master image opened in new tab', 'info');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/photo/${photo.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Photograph link copied to clipboard', 'info');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Dark Backdrop Scrim for Focus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 w-full max-w-5xl rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200 bg-zinc-50">
            {photo.author ? (
              <Link
                to={`/@${photo.author.username}`}
                onClick={onClose}
                className="flex items-center gap-3 group"
              >
                <Avatar
                  src={photo.author.avatar_url}
                  alt={photo.author.full_name}
                  size="md"
                  isVerified={photo.author.is_verified}
                />
                <div>
                  <h3 className="font-sans text-sm sm:text-base font-semibold text-zinc-900 group-hover:text-nature-accent transition-colors">
                    {photo.author.full_name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    @{photo.author.username}
                  </p>
                </div>
              </Link>
            ) : (
              <span className="font-serif text-lg text-zinc-900">NatureLens Preview</span>
            )}

            <div className="flex items-center gap-2">
              <Link
                to={`/photo/${photo.id}`}
                onClick={onClose}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-nature-accent hover:bg-zinc-100 transition-colors hidden sm:flex items-center gap-1.5 border border-zinc-200"
              >
                <span>Full Story</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Grid: Photo Preview & Download Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            {/* Left: High-Res Photo Display */}
            <div className="lg:col-span-7 bg-stone-950 flex items-center justify-center p-4 sm:p-8 min-h-[340px] sm:min-h-[460px]">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] flex items-center justify-center">
                <img
                  src={photo.display_url}
                  alt={photo.title}
                  className="w-auto h-auto max-h-[58vh] max-w-full object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Right: Actions, Download Selector & EXIF Specs */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white overflow-y-auto max-h-[80vh] lg:max-h-[650px]">
              <div className="space-y-5">
                {/* Title & Category */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-nature-accent px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                      {photo.category?.name || 'Nature'}
                    </span>
                    {photo.location_name && (
                      <span className="text-xs text-zinc-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-nature-accent" />
                        {photo.location_name}
                      </span>
                    )}
                  </div>
                  <h2 className="font-sans text-xl sm:text-2xl font-semibold text-zinc-900 leading-snug">
                    {photo.title}
                  </h2>
                </div>

                {/* Download Resolution Selector */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                    Choose Download Resolution
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedResolution('original')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedResolution === 'original'
                          ? 'border-nature-accent bg-amber-500/10 text-zinc-900 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                      }`}
                    >
                      <span className="font-semibold block text-zinc-900">Original Master</span>
                      <span className="text-[10px] font-mono text-zinc-500">Original Dimensions • Full Quality</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedResolution('4k')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedResolution === '4k'
                          ? 'border-nature-accent bg-amber-500/10 text-zinc-900 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                      }`}
                    >
                      <span className="font-semibold block text-zinc-900">4K Wallpaper</span>
                      <span className="text-[10px] font-mono text-zinc-500">3840 × 2160 • Ultra HD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedResolution('1080p')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedResolution === '1080p'
                          ? 'border-nature-accent bg-amber-500/10 text-zinc-900 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                      }`}
                    >
                      <span className="font-semibold block text-zinc-900">Desktop Full HD</span>
                      <span className="text-[10px] font-mono text-zinc-500">1920 × 1080 • High Definition</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedResolution('mobile')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedResolution === 'mobile'
                          ? 'border-nature-accent bg-amber-500/10 text-zinc-900 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                      }`}
                    >
                      <span className="font-semibold block text-zinc-900">Mobile Wallpaper</span>
                      <span className="text-[10px] font-mono text-zinc-500">1080 × 1920 • Vertical</span>
                    </button>
                  </div>
                </div>

                {/* Primary Download Button */}
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleDownload}
                  isLoading={isDownloading}
                  className="w-full justify-center shadow-md text-white font-medium"
                  leftIcon={downloadSuccess ? <Check className="w-5 h-5 text-white" /> : <Download className="w-5 h-5 text-white" />}
                >
                  {downloadSuccess ? 'Photograph Downloaded!' : 'Download High-Resolution Image'}
                </Button>

                {/* Engagement Interactions Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isLiked ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={handleLike}
                      leftIcon={<Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />}
                    >
                      {formatCompactNumber(likesCount)}
                    </Button>
                    <Button
                      variant={isSaved ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={handleSaveToggle}
                      leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-nature-accent" /> : <Share2 className="w-3.5 h-3.5" />}
                  >
                    {copiedLink ? 'Copied' : 'Share'}
                  </Button>
                </div>

                {/* EXIF Readout Accordion / Card */}
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-nature-accent font-sans font-semibold text-[11px] uppercase tracking-wider pb-1 border-b border-zinc-200">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera & Exposure</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-zinc-500 block">Camera</span>
                      <span className="text-zinc-900 font-semibold">{photo.exif.camera_model || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Lens</span>
                      <span className="text-zinc-900 truncate block">{photo.exif.lens || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Aperture & Shutter</span>
                      <span className="text-zinc-900">{photo.exif.aperture} • {photo.exif.shutter_speed}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">ISO Sensitivity</span>
                      <span className="text-zinc-900">ISO {photo.exif.iso || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Ethical Conservation Notice */}
                <div className="flex items-center gap-2 text-[11px] text-zinc-600 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                  <ShieldCheck className="w-4 h-4 text-nature-accent shrink-0" />
                  <span>Free for personal and wallpaper use. Captured following ethical wildlife standards.</span>
                </div>
              </div>

              {/* Footer View Count */}
              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {formatCompactNumber(photo.views_count)} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Captured {formatEditorialDate(photo.created_at)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PhotoDownloadModal;
