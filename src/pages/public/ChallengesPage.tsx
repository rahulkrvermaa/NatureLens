import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNatureStore } from '@/store/useNatureStore';

export const ChallengesPage: React.FC = () => {
  const challenges = useNatureStore((s) => s.challenges);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
          <Trophy className="w-4 h-4 text-nature-accent" />
          <span>Curated Competitions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-nature-parchment">
          NatureLens Challenges
        </h1>
        <p className="mt-3 text-base text-nature-textMuted leading-relaxed">
          Themed exhibitions adjudicated by professional field naturalists and conservation editors. Free to enter for all registered members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="group rounded-3xl overflow-hidden bg-nature-surface border border-nature-border flex flex-col justify-between shadow-sm hover:border-nature-accent/60 hover:shadow-md transition-all duration-300"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={challenge.cover_image_url}
                alt={challenge.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider ${
                    challenge.status === 'active'
                      ? 'bg-nature-accent text-white'
                      : 'bg-black/60 text-white backdrop-blur-md border border-white/20'
                  }`}
                >
                  {challenge.status === 'active' ? 'Active' : 'Concluded'}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 -mt-6 relative z-10 bg-nature-surface rounded-t-3xl flex flex-col justify-between flex-1">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-medium text-nature-parchment group-hover:text-nature-accent transition-colors">
                  {challenge.title}
                </h2>
                <p className="text-xs text-nature-textMuted line-clamp-3 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {challenge.prizes && (
                <div className="p-3 rounded-xl bg-nature-elevated border border-nature-border text-xs">
                  <span className="text-nature-accent font-semibold block text-[11px] mb-0.5">Prizes:</span>
                  <span className="text-nature-parchment line-clamp-2">{challenge.prizes}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-nature-border text-xs text-nature-textMuted">
                <span className="flex items-center gap-1.5 font-mono">
                  <Users className="w-3.5 h-3.5 text-nature-accent" />
                  {challenge.entries_count} Entries
                </span>
                <Link to={`/challenges/${challenge.slug}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
