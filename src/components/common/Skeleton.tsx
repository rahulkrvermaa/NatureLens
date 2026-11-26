import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'md',
  ...props
}) => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-nature-elevated/60',
        roundedStyles[rounded],
        className
      )}
      {...props}
    />
  );
};
