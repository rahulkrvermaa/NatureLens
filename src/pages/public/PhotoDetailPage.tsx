import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Heart,
  Bookmark,
  Share2,
  MapPin,
  Calendar,
  Eye,
  ShieldCheck,
  Check,
  SlidersHorizontal,
  MessageSquare,
  Send,
  Trash2,
} from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { Lens } from '@/components/gallery/Lens';
import { ImageComparisonSlider } from '@/components/gallery/ImageComparisonSlider';
import { formatCompactNumber, formatEditorialDate } from '@/lib/utils';
import { useNatureStore } from '@/store/useNatureStore';
import { usePageMeta } from '@/lib/seo';
import { useToast } from '@/context/useToast';

export const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const photos = useNatureStore((s) => s.photos);
  const likedPhotoIds = useNatureStore((s) => s.likedPhotoIds);
  const savedPhotoIds = useNatureStore((s) => s.savedPhotoIds);
  const followedUserIds = useNatureStore((s) => s.followedUserIds);
  const commentsByPhoto = useNatureStore((s) => s.commentsByPhoto);
  const currentUser = useNatureStore((s) => s.currentUser);

  const toggleLike = useNatureStore((s) => s.toggleLike);
  const toggleSave = useNatureStore((s) => s.toggleSave);
  const toggleFollow = useNatureStore((s) => s.toggleFollow);
  const incrementView = useNatureStore((s) => s.incrementView);
  const addComment = useNatureStore((s) => s.addComment);
  const deleteComment = useNatureStore((s) => s.deleteComment);

  const photo = photos.find((p) => p.id === id) || photos[0];
  const [copiedLink, setCopiedLink] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [commentText, setCommentText] = useState('');
  const lastViewedIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (photo?.id && lastViewedIdRef.current !== photo.id) {
      lastViewedIdRef.current = photo.id;
      incrementView(photo.id);
    }
  }, [photo?.id, incrementView]);

  const photoJsonLd = React.useMemo(
    () =>
      photo
        ? {
            '@context': 'https://schema.org',
            '@type': 'Photograph',
            name: photo.title,
            description: photo.description || photo.title,
            image: photo.display_url,
            creator: photo.author
              ? { '@type': 'Person', name: photo.author.full_name }
              : undefined,
            datePublished: photo.created_at,
          }
        : undefined,
    [photo]
  );

  usePageMeta({
    title: photo ? `${photo.title} — NatureLens` : 'Photograph — NatureLens',
    description: photo?.description || `${photo?.title || 'Nature photograph'} on NatureLens.`,
    image: photo?.display_url,
    canonicalPath: photo ? `/photo/${photo.id}` : undefined,
    jsonLd: photoJsonLd,
  });

  if (!photo) return null;

  const isLiked = likedPhotoIds.includes(photo.id) || (photo.is_liked_by_user ?? false);
  const isSaved = savedPhotoIds.includes(photo.id) || (photo.is_saved_by_user ?? false);
  const isFollowing = photo.author ? followedUserIds.includes(photo.author.id) : false;
  const comments = commentsByPhoto[photo.id] || [];
  const relatedPhotos = photos.filter((p) => p.id !== photo.id).slice(0, 3);

  const handleLike = () => {
    const next = toggleLike(photo.id);
    showToast(next ? 'Added to liked photographs' : 'Removed from liked', 'info');
  };

  const handleSave = () => {
    const next = toggleSave(photo.id);
    showToast(next ? 'Saved to your collection' : 'Removed from collection', 'info');
  };

  const handleFollow = () => {
    if (!photo.author) return;
    const next = toggleFollow(photo.author.id);
    showToast(next ? `Following ${photo.author.full_name}` : `Unfollowed ${photo.author.full_name}`, 'info');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Link copied to clipboard', 'info');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(photo.id, commentText);
    setCommentText('');
    showToast('Comment posted in real time', 'success');
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back button & Control Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-nature-textMuted hover:text-nature-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
        </Link>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
            showComparison
              ? 'bg-nature-accent text-white border-nature-accent font-semibold shadow-sm'
              : 'bg-nature-elevated text-nature-textMuted border-nature-border hover:text-nature-parchment'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showComparison ? 'Exit RAW Comparison' : 'Compare RAW vs Master'}</span>
        </button>
      </div>

      {/* Main Theater Display */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-nature-border flex items-center justify-center p-2 sm:p-6 shadow-xl">
        {showComparison ? (
          <div className="w-full max-w-4xl aspect-[16/10]">
            <ImageComparisonSlider
              beforeImage={photo.thumbnail_url}
              afterImage={photo.display_url}
              beforeLabel="RAW Linear Profile"
              afterLabel="Master Fine-Art Grade"
              altBefore="RAW camera capture"
              altAfter="Processed fine-art photograph"
              className="h-full w-full"
            />
          </div>
        ) : (
          <Lens zoomFactor={2.4} lensSize={220} showControls={true} className="max-h-[80vh] flex items-center justify-center">
            <img
              src={photo.display_url}
              alt={photo.title}
              className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </Lens>
        )}
      </div>

      {/* Primary Interaction & Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link
                to={`/category/${photo.category?.slug}`}
                className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-nature-elevated text-nature-accent border border-nature-border hover:bg-nature-border/50 transition-colors"
              >
                {photo.category?.name}
              </Link>
              {photo.is_editor_choice && (
                <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-nature-accent border border-nature-accent/30">
                  Editor's Choice
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment leading-tight">
              {photo.title}
            </h1>
          </div>

          {/* Author Block */}
          {photo.author && (
            <div className="flex items-center justify-between p-5 rounded-2xl bg-nature-surface border border-nature-border shadow-sm">
              <Link to={`/@${photo.author.username}`} className="flex items-center gap-4 group">
                <Avatar
                  src={photo.author.avatar_url}
                  alt={photo.author.full_name}
                  size="lg"
                  isVerified={photo.author.is_verified}
                />
                <div>
                  <h3 className="font-serif text-lg font-medium text-nature-parchment group-hover:text-nature-accent transition-colors">
                    {photo.author.full_name}
                  </h3>
                  <p className="text-xs text-nature-textMuted font-mono">
                    @{photo.author.username}
                  </p>
                </div>
              </Link>
              <Button variant={isFollowing ? 'secondary' : 'outline'} size="sm" onClick={handleFollow}>
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          )}

          {/* Narrative */}
          {photo.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-nature-textMuted">
                Photographer's Notes
              </h3>
              <p className="text-sm sm:text-base text-nature-parchment/90 leading-relaxed font-light">
                {photo.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-nature-textMuted">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?tag=${tag}`}
                    className="text-xs px-3 py-1 rounded-full bg-nature-surface border border-nature-border text-nature-textMuted hover:text-nature-accent hover:border-nature-accent/40 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ethical Wildlife Pledge Notice */}
          <div className="p-4 rounded-xl bg-nature-elevated/60 border border-nature-border flex items-start gap-3 text-xs text-nature-textMuted">
            <ShieldCheck className="w-4 h-4 text-nature-accent shrink-0 mt-0.5" />
            <p>
              Captured following ethical wildlife photography principles. Exact coordinates have been hidden to protect local nesting and foraging grounds.
            </p>
          </div>

          {/* Real-Time Discussion & Comments */}
          <div className="pt-6 border-t border-nature-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-medium text-nature-parchment flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-nature-accent" />
                <span>Field Critique & Notes ({comments.length})</span>
              </h3>
            </div>

            <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <input
                type="text"
                placeholder="Share constructive critique or ask about the field conditions..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-nature-surface border border-nature-border text-sm text-nature-parchment placeholder-nature-textSubtle focus:outline-none focus:border-nature-accent"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!commentText.trim()}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Post
              </Button>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-xs text-nature-textMuted py-4">
                  No comments yet. Be the first to share your thoughts on this capture!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-2xl bg-nature-surface border border-nature-border flex items-start gap-3.5"
                  >
                    <Avatar
                      src={comment.author.avatar_url}
                      alt={comment.author.full_name}
                      size="sm"
                      isVerified={comment.author.is_verified}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-nature-parchment">
                            {comment.author.full_name}
                          </span>
                          <span className="text-[11px] font-mono text-nature-textSubtle">
                            @{comment.author.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-nature-textSubtle">
                            {formatEditorialDate(comment.created_at)}
                          </span>
                          {(currentUser?.id === comment.user_id || comment.user_id === 'usr-guest') && (
                            <button
                              type="button"
                              onClick={() => deleteComment(photo.id, comment.id)}
                              className="text-nature-textSubtle hover:text-red-500 transition-colors"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-nature-parchment/90 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & EXIF Specifications */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-nature-surface border border-nature-border space-y-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={isLiked ? 'primary' : 'secondary'}
                onClick={handleLike}
                leftIcon={<Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />}
                className="w-full justify-center"
              >
                {formatCompactNumber(photo.likes_count)} Likes
              </Button>
              <Button
                variant={isSaved ? 'primary' : 'secondary'}
                onClick={handleSave}
                leftIcon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />}
                className="w-full justify-center"
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleShare}
              leftIcon={copiedLink ? <Check className="w-4 h-4 text-nature-accent" /> : <Share2 className="w-4 h-4" />}
              className="w-full justify-center"
            >
              {copiedLink ? 'Link Copied to Clipboard!' : 'Share Photograph'}
            </Button>

            <div className="pt-2 border-t border-nature-border/40 flex items-center justify-between text-xs text-nature-textMuted">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-nature-accent" />
                {formatCompactNumber(photo.views_count)} views
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-nature-accent" />
                {formatEditorialDate(photo.created_at)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-nature-surface border border-nature-border space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-nature-accent">
              <Camera className="w-4 h-4" />
              <span>Camera & Exposure</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">Camera Make</span>
                <span className="text-nature-parchment">{photo.exif.camera_make || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">Model</span>
                <span className="text-nature-parchment">{photo.exif.camera_model || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">Lens</span>
                <span className="text-nature-parchment">{photo.exif.lens || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">Focal Length</span>
                <span className="text-nature-parchment">{photo.exif.focal_length || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">Aperture</span>
                <span className="text-nature-parchment">{photo.exif.aperture || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">Shutter Speed</span>
                <span className="text-nature-parchment">{photo.exif.shutter_speed || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                <span className="text-nature-textMuted font-sans">ISO</span>
                <span className="text-nature-parchment">{photo.exif.iso || 'N/A'}</span>
              </div>
              {photo.location_name && (
                <div className="flex justify-between py-1.5 border-b border-nature-border/40">
                  <span className="text-nature-textMuted font-sans">Location</span>
                  <span className="text-nature-parchment flex items-center gap-1 font-sans">
                    <MapPin className="w-3 h-3 text-nature-accent" />
                    {photo.location_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Photographs */}
      <div className="pt-12 border-t border-nature-border space-y-6">
        <h2 className="font-serif text-2xl font-medium text-nature-parchment">
          More From NatureLens
        </h2>
        <MasonryGrid photos={relatedPhotos} />
      </div>
    </div>
  );
};
