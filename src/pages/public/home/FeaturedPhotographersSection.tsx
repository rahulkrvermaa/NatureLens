import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Users, MapPin, Camera, Heart, Plus, Check } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { formatCompactNumber } from '@/lib/utils';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';

export const FeaturedPhotographersSection: React.FC = () => {
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const profiles = useNatureStore((s) => s.profiles);
  const photos = useNatureStore((s) => s.photos);
  const followedUserIds = useNatureStore((s) => s.followedUserIds);
  const toggleFollow = useNatureStore((s) => s.toggleFollow);

  const featuredProfiles = profiles.slice(0, 6);
  const marqueeItems = [...featuredProfiles, ...featuredProfiles];

  return (
    <section className="py-20 sm:py-24 bg-nature-surface border-t border-nature-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
            <Users className="w-4 h-4" />
            <span>Community</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
            Featured Photographers
          </h2>
          <p className="mt-3 text-sm text-nature-textMuted">
            Meet the naturalists, expedition photographers, and artists documenting life across the planet.
          </p>
        </motion.div>

        <div className="relative group/marquee overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Left & Right Edge Fade Masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-nature-surface via-nature-surface/80 to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-nature-surface via-nature-surface/80 to-transparent z-10"
          />

          <div className="animate-nl-marquee gap-5 sm:gap-7 py-2">
            {marqueeItems.map((profile, index) => {
              const authorPhotos = photos.filter((p) => p.user_id === profile.id);
              const isFollowing = followedUserIds.includes(profile.id);
              const isDuplicate = index >= featuredProfiles.length;
              return (
                <div
                  key={`${profile.id}-${index}`}
                  aria-hidden={isDuplicate ? true : undefined}
                  className="w-[82vw] sm:w-[340px] lg:w-[370px] shrink-0 bg-nature-dark rounded-2xl border border-nature-border p-6 flex flex-col justify-between shadow-sm hover:border-nature-accent/50 hover:shadow-md transition-all duration-300 group"
                >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/@${profile.username}`} className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        size="lg"
                        isVerified={profile.is_verified}
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-medium text-nature-parchment group-hover:text-nature-accent transition-colors truncate">
                          {profile.full_name}
                        </h3>
                        <p className="text-xs text-nature-textMuted font-mono truncate">
                          @{profile.username}
                        </p>
                      </div>
                    </Link>
                    <Button
                      variant={isFollowing ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const next = toggleFollow(profile.id);
                        showToast(
                          next ? `Following ${profile.full_name}` : `Unfollowed ${profile.full_name}`,
                          'info'
                        );
                      }}
                      leftIcon={isFollowing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>

                  {profile.location && (
                    <div className="flex items-center gap-1.5 text-xs text-nature-accent mt-3">
                      <MapPin className="w-3 h-3" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-nature-textMuted mt-3 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-5">
                    {authorPhotos.slice(0, 2).map((photo) => (
                      <Link
                        key={photo.id}
                        to={`/photo/${photo.id}`}
                        className="rounded-xl overflow-hidden aspect-[4/3] relative group/photo"
                      >
                        <img
                          src={photo.thumbnail_url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110"
                        />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 mt-5 border-t border-nature-border text-xs text-nature-textSubtle">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-nature-accent" />
                    <strong className="text-nature-parchment font-mono">
                      {Math.max(profile.photos_count, authorPhotos.length)}
                    </strong>{' '}
                    works
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    <strong className="text-nature-parchment font-mono">
                      {formatCompactNumber(profile.likes_received_count)}
                    </strong>{' '}
                    likes
                  </span>
                  <span>
                    <strong className="text-nature-parchment font-mono">
                      {formatCompactNumber(profile.followers_count)}
                    </strong>{' '}
                    followers
                  </span>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
