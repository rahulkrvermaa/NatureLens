import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ShieldCheck, Heart, Compass, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-nature-surface border-t border-nature-border pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-nature-border/60">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-nature-elevated border border-nature-border flex items-center justify-center">
                <Camera className="w-4 h-4 text-nature-accent" />
              </div>
              <span className="font-serif text-2xl font-semibold text-nature-parchment">
                Nature<span className="text-nature-accent">Lens</span>
              </span>
            </Link>
            <p className="text-sm text-nature-textMuted max-w-md leading-relaxed">
              A curated community for landscape, wildlife, and macro photographers. Built to showcase the beauty of the natural world with respect and ethical field craft.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-elevated border border-nature-border text-xs text-nature-accent font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Committed to Ethical Wildlife Photography
              </span>
            </div>
          </div>

          {/* Quick Discover Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-nature-textMuted">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="text-nature-textMuted hover:text-nature-accent transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Explore Gallery
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-nature-textMuted hover:text-nature-accent transition-colors">
                  All 11 Biome Categories
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="text-nature-textMuted hover:text-nature-accent transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Photography Challenges
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=editors-choice" className="text-nature-textMuted hover:text-nature-accent transition-colors">
                  Editor's Selection
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-nature-textMuted">
              Ethics & Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#ethics-manifesto" className="text-nature-textMuted hover:text-nature-accent transition-colors">
                  Wildlife Code of Ethics
                </a>
              </li>
              <li>
                <span className="text-nature-textMuted">GPS Protection Policy</span>
              </li>
              <li>
                <Link to="/upload" className="text-nature-textMuted hover:text-nature-accent transition-colors">
                  Contributor Guidelines
                </Link>
              </li>
              <li>
                <span className="text-nature-textMuted">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-nature-textSubtle gap-4">
          <p>© {new Date().getFullYear()} NatureLens Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Preserving biodiversity through visual artistry</span>
            <Heart className="w-3 h-3 text-nature-accent inline ml-1 fill-nature-accent/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};
