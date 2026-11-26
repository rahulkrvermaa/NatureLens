import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, Sparkles, Camera } from 'lucide-react';

export interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
  initialPosition?: number;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Raw Sensor File',
  afterLabel = 'Master Fine-Art Grade',
  altBefore = 'Before editing',
  altAfter = 'After fine-art processing',
  className,
  initialPosition = 50,
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;

    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;

    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleSliderMove(e.touches[0].clientX);
    },
    [isDragging, handleSliderMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleSliderMove(e.clientX);
    },
    [isDragging, handleSliderMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden select-none w-full rounded-2xl border border-nature-border bg-nature-moss shadow-editorial group',
        className
      )}
    >
      {/* Background Layer: "After" Image */}
      <img
        src={afterImage}
        alt={altAfter}
        className="w-full h-full object-cover pointer-events-none"
        loading="lazy"
      />

      {/* Foreground Layer: "Before" Image (Clipped dynamically by slider width) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={altBefore}
          className="absolute inset-0 h-full object-cover pointer-events-none max-w-none"
          style={{
            width: `${(100 / sliderPosition) * 100}%`,
          }}
          loading="lazy"
        />
      </div>

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-dark/80 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-nature-textMuted border border-nature-border/80">
          <Camera className="w-3 h-3 text-nature-textMuted" />
          {beforeLabel}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-dark/80 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-nature-accent border border-nature-accent/30 shadow-card-glow">
          <Sparkles className="w-3 h-3 text-nature-accent" />
          {afterLabel}
        </span>
      </div>

      {/* Draggable Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-nature-accent cursor-ew-resize z-20 shadow-[0_0_12px_rgba(182,211,155,0.7)]"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-nature-accent text-nature-dark shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-nature-dark/60 transition-transform group-hover:scale-110 active:scale-95">
          <SlidersHorizontal className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </div>
  );
};
