import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';

function formatCountdown(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Closed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return `${days}d ${hours}h ${mins}m ${secs}s`;
}

export const ChallengeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();

  const challenges = useNatureStore((s) => s.challenges);
  const photos = useNatureStore((s) => s.photos);
  const enteredChallengeIds = useNatureStore((s) => s.enteredChallengeIds);
  const enterChallenge = useNatureStore((s) => s.enterChallenge);

  const challenge = challenges.find((c) => c.slug === slug) || challenges[0];
  const hasEntered = challenge ? enteredChallengeIds.includes(challenge.id) : false;

  const [selectedPhotoId, setSelectedPhotoId] = useState(photos[0]?.id || '');
  const [countdown, setCountdown] = useState(() =>
    challenge ? formatCountdown(challenge.end_date) : ''
  );

  useEffect(() => {
    if (!challenge || challenge.status !== 'active') return;
    const timer = setInterval(() => {
      setCountdown(formatCountdown(challenge.end_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge]);

  if (!challenge) return null;

  const handleEnter = () => {
    if (!selectedPhotoId) return;
    enterChallenge(challenge.id, selectedPhotoId);
    showToast(`Submitted entry to "${challenge.title}"!`, 'success');
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Link
        to="/challenges"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-nature-textMuted hover:text-nature-accent transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Challenges
      </Link>

      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-nature-surface border border-nature-border h-80 sm:h-96 flex items-end p-8 sm:p-12 shadow-md">
        <img
          src={challenge.cover_image_url}
          alt={challenge.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-nature-accent text-white font-semibold text-xs uppercase tracking-wider">
            {challenge.status === 'active' ? 'Active Challenge' : 'Exhibition Closed'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-white">
            {challenge.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-200">
            {challenge.description}
          </p>
        </div>
      </div>

      {/* Submission & Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 rounded-3xl bg-nature-surface border border-nature-border space-y-4 shadow-sm">
            <h2 className="font-serif text-2xl font-medium text-nature-parchment flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-nature-accent" />
              Submission Rules & Criteria
            </h2>
            <p className="text-sm text-nature-textMuted leading-relaxed">
              {challenge.rules}
            </p>
            <ul className="space-y-2 text-xs text-nature-parchment/90 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nature-accent shrink-0" />
                Raw file or camera JPEG with intact EXIF metadata must be provided.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nature-accent shrink-0" />
                No artificial generative content, composite sky replacements, or cloned animals.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nature-accent shrink-0" />
                Full compliance with the NatureLens Ethical Wildlife Charter.
              </li>
            </ul>
          </div>

          {challenge.prizes && (
            <div className="p-8 rounded-3xl bg-nature-surface border border-nature-border space-y-3 shadow-sm">
              <h2 className="font-serif text-2xl font-medium text-nature-parchment flex items-center gap-2">
                <Award className="w-5 h-5 text-nature-accent" />
                Awards & Honours
              </h2>
              <p className="text-sm text-nature-parchment/90 leading-relaxed font-light">
                {challenge.prizes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-nature-surface border border-nature-border space-y-6 shadow-sm">
            {challenge.status === 'active' && (
              <div className="p-3.5 rounded-2xl bg-nature-elevated border border-nature-border flex items-center justify-between">
                <span className="text-xs text-nature-textMuted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-nature-accent" />
                  Time Left
                </span>
                <span className="text-xs font-mono font-semibold text-nature-accent">
                  {countdown}
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs text-nature-textMuted">
              <div className="flex items-center justify-between pb-3 border-b border-nature-border">
                <span>Submissions Open</span>
                <span className="text-nature-parchment font-mono">{challenge.start_date.split('T')[0]}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-nature-border">
                <span>Closing Deadline</span>
                <span className="text-nature-parchment font-mono">{challenge.end_date.split('T')[0]}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-nature-border">
                <span>Current Entries</span>
                <span className="text-nature-parchment font-mono font-semibold">{challenge.entries_count}</span>
              </div>
            </div>

            {challenge.status === 'active' ? (
              hasEntered ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-nature-emerald mx-auto" />
                  <p className="text-xs font-semibold text-nature-parchment">Entry Confirmed</p>
                  <p className="text-[11px] text-nature-textMuted">Your photograph is in judging queue.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-nature-textMuted">
                    Select Photograph to Enter
                  </label>
                  <select
                    value={selectedPhotoId}
                    onChange={(e) => setSelectedPhotoId(e.target.value)}
                    className="w-full bg-nature-elevated border border-nature-border rounded-xl px-3 py-2 text-xs text-nature-parchment focus:outline-none focus:border-nature-accent"
                  >
                    {photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <Button size="lg" variant="primary" className="w-full justify-center" onClick={handleEnter}>
                    Enter Selected Photograph
                  </Button>
                  <Link to="/upload" className="block text-center text-xs text-nature-accent hover:underline pt-1">
                    Or upload a new photograph
                  </Link>
                </div>
              )
            ) : (
              <Link to="/explore">
                <Button size="lg" variant="outline" className="w-full justify-center">
                  Explore Winning Works
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
