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
      layerRefs.current.forEach((el, index) => {
        if (!el) return;
        const layer = layers[index];
        if (!layer) return;

        const { speedX, speedY, speedZ, rotation } = layer;
        const computedLeft = parseFloat(getComputedStyle(el).left.replace('px', '')) || 0;
        const isInLeft = computedLeft < window.innerWidth / 2 ? 1 : -1;
        const zValue = (cursorPosition - computedLeft) * isInLeft * 0.1;

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

        const computedLeft =
          parseFloat(getComputedStyle(textRef.current).left.replace('px', '')) || 0;
        const isInLeft = computedLeft < window.innerWidth / 2 ? 1 : -1;
        const zValue = (cursorPosition - computedLeft) * isInLeft * 0.1;

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
    const handleMouseMove = (e: MouseEvent) => {
      const newXValue = e.clientX - window.innerWidth / 2;
      const newYValue = e.clientY - window.innerHeight / 2;
      const newRotateDegree = (newXValue / (window.innerWidth / 2)) * 20;

      updateLayers(e.clientX, newXValue, newYValue, newRotateDegree);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateLayers]);

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative h-[78vh] sm:h-[88vh] min-h-[520px] sm:min-h-[600px] w-full overflow-hidden select-none transition-colors duration-700',
        skyClassName,
        className
      )}
    >
      <div className="absolute inset-0 z-[100] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_55%,rgba(0,0,0,0.75))]" />

      {layers.map((layer, index) => (
        <img
          key={`${layer.alt}-${index}`}
          ref={(el) => {
            layerRefs.current[index] = el;
          }}
          src={layer.src}
          alt={layer.alt}
          className={cn(
            'absolute pointer-events-none max-w-none transition-transform duration-[450ms] ease-out',
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
      ))}

      <div
        ref={textRef}
        className="absolute z-[9] text-white text-center pointer-events-auto transition-transform duration-[450ms] ease-out w-full px-4"
        style={{
          top: 'calc(50% - 80px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h1 className="font-black tracking-tight text-white/95 drop-shadow-2xl text-[clamp(2.75rem,10.5vw,10.5rem)] leading-[0.85]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-[11px] sm:text-sm font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/85 drop-shadow px-2">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
};

export default ParallaxHero;
