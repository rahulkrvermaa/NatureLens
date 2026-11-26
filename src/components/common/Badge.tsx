import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'moss' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'moss',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    accent: 'bg-nature-accent/15 text-nature-accent border border-nature-accent/30',
    moss: 'bg-nature-surface text-nature-parchment border border-nature-border',
    outline: 'border border-nature-border text-nature-textMuted',
    subtle: 'bg-nature-elevated text-nature-textMuted border border-nature-border/50',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs px-3 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
