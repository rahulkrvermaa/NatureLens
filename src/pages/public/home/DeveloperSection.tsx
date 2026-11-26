import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const DeveloperSection: React.FC = () => {
  return (
    <section className="py-10 bg-nature-dark border-t border-nature-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-nature-surface border border-nature-border p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src="/photos/rahul-verma.jpg"
              alt="Rahul Verma"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover object-top border border-nature-border shrink-0"
            />
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-wider text-nature-accent font-semibold">
                Developer &amp; Creator
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-nature-parchment">
                Rahul Verma
              </h2>
              <p className="text-xs text-nature-textMuted max-w-md">
                Full-stack developer &amp; nature photographer · React, TypeScript &amp; Supabase
              </p>
            </div>
          </div>

          <a
            href="https://my-portfolio01432.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-nature-parchment text-nature-dark hover:opacity-90 text-xs font-semibold tracking-wide transition-opacity shrink-0"
          >
            <span>Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
