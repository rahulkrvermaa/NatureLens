import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nature-accent focus-visible:ring-offset-2 focus-visible:ring-offset-nature-dark disabled:opacity-50 disabled:pointer-events-none select-none tracking-wide';

    const variants = {
      primary:
        'bg-nature-accent text-white hover:bg-nature-accentHover shadow-sm font-semibold hover:shadow-card-glow',
      secondary:
        'bg-nature-surface text-nature-parchment hover:bg-nature-elevated border border-nature-border shadow-sm',
      outline:
        'border border-nature-border text-nature-parchment hover:bg-nature-elevated hover:text-nature-parchment',
      ghost:
        'text-nature-textMuted hover:text-nature-parchment hover:bg-nature-elevated',
      danger:
        'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-full gap-2',
      lg: 'text-base px-7 py-3.5 rounded-full gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
