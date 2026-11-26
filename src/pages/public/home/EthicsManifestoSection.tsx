import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, EyeOff, TreePine, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const EthicsManifestoSection: React.FC = () => {
  return (
    <section id="ethics-manifesto" className="py-24 bg-nature-surface border-t border-nature-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Manifesto Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nature-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>Ethical Photography</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-nature-parchment leading-tight">
              The subject's wellbeing always comes first.
            </h2>
            <p className="text-base text-nature-textMuted leading-relaxed">
              Nature photography should inspire conservation, never disrupt it. We ask every photographer who shares work here to uphold two core commitments:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-nature-dark border border-nature-border space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-nature-accent">
                  <EyeOff className="w-4 h-4" />
                  <h3 className="font-medium text-sm text-nature-parchment">Habitat Protection</h3>
                </div>
                <p className="text-xs text-nature-textMuted leading-relaxed">
                  Precise GPS coordinates are automatically removed from public images to prevent disturbance to fragile nesting areas and sensitive species.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-nature-dark border border-nature-border space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-nature-accent">
                  <TreePine className="w-4 h-4" />
                  <h3 className="font-medium text-sm text-nature-parchment">Respectful Distance</h3>
                </div>
                <p className="text-xs text-nature-textMuted leading-relaxed">
                  No baiting, no recorded audio calls during breeding season, and no invasive drone flights near wildlife. Let wild creatures remain wild.
                </p>
              </div>
            </div>
          </div>

          {/* Invitation Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-nature-elevated to-nature-surface p-8 sm:p-10 rounded-3xl border border-nature-border text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-nature-accent/15 border border-nature-accent/30 flex items-center justify-center mx-auto text-nature-accent">
              <HeartHandshake className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-nature-parchment">
              Join the Community
            </h3>

            <p className="text-sm text-nature-textMuted leading-relaxed">
              Whether you shoot with a telephoto lens on expedition or photograph birds in your local park, share your work with people who appreciate the natural world.
            </p>

            <div className="pt-2">
              <Link to="/signup">
                <Button size="lg" variant="primary" className="w-full justify-center shadow-md">
                  Create a Free Account <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-nature-textSubtle">
              Free for photographers • Ad-free experience • Full quality exports
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
