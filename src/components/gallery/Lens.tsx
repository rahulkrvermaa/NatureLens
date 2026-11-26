import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut } from 'lucide-react';

const getSupportsLens = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
};

export interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  isStatic?: boolean;
  position?: { x: number; y: number };
  className?: string;
  showControls?: boolean;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 2,
  lensSize = 180,
  isStatic = false,
  position = { x: 200, y: 200 },
  className,
  showControls = true,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [supportsLens, setSupportsLens] = useState<boolean>(getSupportsLens);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setSupportsLens(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setSupportsLens(event.matches);
      if (!event.matches) {
        setIsHovering(false);
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!supportsLens || isStatic || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    },
    [supportsLens, isStatic]
  );

  const currentX = isStatic ? position.x : mousePosition.x;
  const currentY = isStatic ? position.y : mousePosition.y;
  const lensEnabled = supportsLens && isActive;

  return (
    <div className="relative group/lens">
      <div
        ref={containerRef}
        onMouseEnter={() => {
          if (supportsLens) setIsHovering(true);
        }}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className={cn(
          'relative overflow-hidden rounded-2xl select-none',
          lensEnabled && isHovering && 'cursor-none',
          className
        )}
      >
        {/* Original Content */}
        {children}

        {/* Magnifying Lens Circle (desktop/fine-pointer only) */}
        <AnimatePresence>
          {lensEnabled && (isHovering || isStatic) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none overflow-hidden z-30"
              style={{
                clipPath: `circle(${lensSize / 2}px at ${currentX}px ${currentY}px)`,
              }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: `scale(${zoomFactor})`,
                  transformOrigin: `${currentX}px ${currentY}px`,
                }}
              >
                {children}
              </div>

              {/* Lens Outer Optical Ring / Bezel with glow */}
              <div
                className="absolute pointer-events-none rounded-full border-2 border-nature-accent shadow-[0_0_20px_rgba(182,211,155,0.4)]"
                style={{
                  width: `${lensSize}px`,
                  height: `${lensSize}px`,
                  left: `${currentX - lensSize / 2}px`,
                  top: `${currentY - lensSize / 2}px`,
                }}
              >
                {/* Crosshair indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="w-2.5 h-0.5 bg-nature-accent" />
                  <div className="h-2.5 w-0.5 bg-nature-accent absolute" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating lens trigger control (desktop/fine-pointer only) */}
      {showControls && supportsLens && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 border shadow-lg',
              isActive
                ? 'bg-nature-accent text-nature-dark border-nature-accent font-semibold shadow-card-glow'
                : 'bg-nature-dark/80 text-nature-parchment border-nature-border hover:bg-nature-moss'
            )}
            title="Toggle interactive inspection lens"
          >
            {isActive ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Lens Active (Hover)' : 'Enable Macro Lens'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
