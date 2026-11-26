import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { defaultLayers, type ParallaxLayer } from './wilderness-layers';

export interface ParallaxHeroProps {
  layers?: ParallaxLayer[];
  title?: string;
  subtitle?: string;
  skyClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  layers = defaultLayers,
  title = 'NATURELENS',
  subtitle,
  skyClassName = 'bg-gradient-to-b from-[#08121a] via-[#13293d] to-[#1b3a4b]',
  className,
  children,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);

  const updateLayers = useCallback(
    (cursorPosition: number, xVal: number, yVal: number, rotateDeg: number) => {
      const halfWidth = window.innerWidth / 2;
      layerRefs.current.forEach((el, index) => {
        if (!el) return;
        const layer = layers[index];
        if (!layer) return;

        const { speedX, speedY, speedZ, rotation } = layer;
        const elLeft = el.offsetLeft || halfWidth;
        const isInLeft = elLeft < halfWidth ? 1 : -1;
        const zValue = (cursorPosition - elLeft) * isInLeft * 0.1;

        el.style.transform = `perspective(2300px) translateZ(${
          zValue * speedZ
        }px) rotateY(${rotateDeg * rotation}deg) translateX(calc(-50% + ${
          -xVal * speedX
        }px)) translateY(calc(-50% + ${yVal * speedY}px))`;
      });

      if (textRef.current) {
        const textSpeedX = 0.07;
        const textSpeedY = 0.05;
        const textSpeedZ = 0.08;
        const textRotation = 0.04;

        const textLeft = textRef.current.offsetLeft || halfWidth;
        const isInLeft = textLeft < halfWidth ? 1 : -1;
        const zValue = (cursorPosition - textLeft) * isInLeft * 0.1;

        textRef.current.style.transform = `perspective(2300px) translateZ(${
          zValue * textSpeedZ
        }px) rotateY(${rotateDeg * textRotation}deg) translateX(calc(-50% + ${
          -xVal * textSpeedX
        }px)) translateY(calc(-50% + ${yVal * textSpeedY}px))`;
      }
    },
    [layers]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only run mouse-driven 3D parallax on fine-pointer desktop devices to keep mobile smooth
    const supportsHover =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches;

    if (!supportsHover) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const newXValue = e.clientX - window.innerWidth / 2;
        const newYValue = e.clientY - window.innerHeight / 2;
        const newRotateDegree = (newXValue / (window.innerWidth / 2)) * 20;
        updateLayers(e.clientX, newXValue, newYValue, newRotateDegree);
      });
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateLayers]);

  const isMultiLayerScene = layers.length > 6;

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative h-[68vh] sm:h-[82vh] lg:h-[88vh] min-h-[460px] sm:min-h-[580px] w-full overflow-hidden select-none transition-colors duration-500',
        skyClassName,
        className
      )}
    >
      <div className="absolute inset-0 z-[100] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_45%,rgba(0,0,0,0.78))]" />

      {/* Responsive Layer Wrapper: scales multi-layer mountain scene cleanly on mobile */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          isMultiLayerScene && 'scale-[0.55] sm:scale-[0.8] lg:scale-100 origin-center'
        )}
      >
        {layers.map((layer, index) => {
          const hideOnSmallMobile = isMultiLayerScene && index > 4 && layer.alt.startsWith('fog-');
          return (
            <img
              key={`${layer.alt}-${index}`}
              ref={(el) => {
                layerRefs.current[index] = el;
              }}
              src={layer.src}
              alt={layer.alt}
              decoding="async"
              className={cn(
                'absolute pointer-events-none max-w-none will-change-transform',
                hideOnSmallMobile && 'hidden sm:block',
                layer.className
              )}
              style={{
                width: layer.width,
                top: layer.initialTop,
                left: layer.initialLeft,
                zIndex: layer.zIndex,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>

      <div
        ref={textRef}
        className="absolute z-[9] text-white text-center pointer-events-none w-full px-5 will-change-transform"
        style={{
          top: 'calc(50% - 56px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h1 className="font-black tracking-tight text-white/95 drop-shadow-2xl text-[clamp(1.85rem,8.5vw,9.5rem)] leading-[0.88] break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-sm font-mono uppercase tracking-[0.16em] sm:tracking-[0.25em] text-white/85 drop-shadow max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
};

export default ParallaxHero;
