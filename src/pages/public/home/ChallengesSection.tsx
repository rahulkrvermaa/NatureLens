import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNatureStore } from '@/store/useNatureStore';
import { formatEditorialDate } from '@/lib/utils';

export const ChallengesSection: React.FC = () => {
  const challenges = useNatureStore((s) => s.challenges);

  return (
    <section className="py-24 bg-nature-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent mb-2">
              <Trophy className="w-4 h-4 text-nature-accent" />
              <span>Community Assignments</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
              Photo Challenges
            </h2>
            <p className="mt-2 text-sm text-nature-textMuted max-w-xl">
              Participate in monthly themed assignments. Selected works are featured in curated collections and community showcases.
            </p>
          </div>
          <Link
            to="/challenges"
            className="text-sm font-medium text-nature-accent hover:text-nature-accentHover flex items-center gap-1.5 transition-colors"
          >
            <span>View All Challenges</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.slice(0, 2).map((challenge) => (
            <div
              key={challenge.id}
              className="group relative rounded-3xl overflow-hidden bg-nature-surface border border-nature-border flex flex-col justify-between shadow-sm hover:border-nature-accent/50 hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={challenge.cover_image_url}
                  alt={challenge.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-nature-accent text-stone-950 font-semibold text-xs uppercase tracking-wider shadow-sm">
                    {challenge.status === 'active' ? 'Accepting Entries' : challenge.status}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 -mt-12 relative z-10 bg-nature-surface rounded-3xl">
                <h3 className="font-serif text-2xl font-medium text-nature-parchment group-hover:text-nature-accent transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-sm text-nature-textMuted leading-relaxed">
                  {challenge.description}
                </p>

                {challenge.prizes && (
                  <div className="p-3.5 rounded-xl bg-nature-elevated border border-nature-border text-xs">
                    <span className="text-nature-accent font-semibold block mb-0.5">Prizes & Recognition:</span>
                    <span className="text-nature-parchment">{challenge.prizes}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-nature-border text-xs text-nature-textMuted">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Users className="w-4 h-4 text-nature-accent" />
                      {challenge.entries_count} submissions
                    </span>
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-4 h-4 text-nature-accent" />
                      Closes {formatEditorialDate(challenge.end_date)}
                    </span>
                  </div>

                  <Link to={`/challenges/${challenge.slug}`}>
                    <Button variant="primary" size="sm">
                      Enter Photo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
