import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-nature-moss border border-nature-border flex items-center justify-center text-nature-accent mb-6 shadow-card-glow">
        <Compass className="w-8 h-8" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-nature-accent mb-2">
        Error 404 • Coordinate Lost
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-nature-parchment">
        Off the Beaten Trail
      </h1>
      <p className="mt-4 text-sm sm:text-base text-nature-textMuted max-w-md leading-relaxed">
        The terrain you are seeking has either shifted or was never charted. Return to the known wilderness.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link to="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Sanctuary
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline">
            Explore Archive
          </Button>
        </Link>
      </div>
    </div>
  );
};
