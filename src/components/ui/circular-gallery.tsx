"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '@/types';

export interface CircularGalleryItem {
  id?: string;
  image: string;
  title?: string;
  text?: string;
  subtitle?: string;
  subtext?: string;
  author?: string;
  location?: string;
  category?: string;
  photo?: Photo;
}

export interface CircularGalleryProps {
  items: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  className?: string;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

export const CircularGallery: React.FC<CircularGalleryProps> = ({
  items,
  bend = 0,
  className = '',
  onItemClick,
  autoplay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [, setIsDragging] = useState(false);

  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotation: 0 });
  const dragDistanceRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const totalItems = items.length;
  const anglePerItem = 360 / Math.max(totalItems, 1);
  // Expansive panoramic cylinder radius so cards curve gracefully in 3D
  const radius = 600;

  // Silky-smooth continuous rotation animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDraggingRef.current) {
        if (autoplay && !isHoveredRef.current) {
          // Ambient glide
          targetRotationRef.current -= 5.5 * delta;
        }

        // Smooth physics damping interpolation
        const diff = targetRotationRef.current - rotationRef.current;
        rotationRef.current += diff * Math.min(1, 8.5 * delta);
        setRotation(rotationRef.current);
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [autoplay]);

  // Pointer / Touch Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, rotation: rotationRef.current };
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    dragDistanceRef.current = Math.abs(deltaX);

    const sensitivity = 0.20;
    rotationRef.current = dragStartRef.current.rotation + deltaX * sensitivity;
    targetRotationRef.current = rotationRef.current;
    setRotation(rotationRef.current);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    // Snap smoothly to nearest card
    const nearestIndex = Math.round(targetRotationRef.current / anglePerItem);
    targetRotationRef.current = nearestIndex * anglePerItem;
  };

  // Wheel handler for smooth scroll rotation
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      targetRotationRef.current -= Math.sign(delta) * (anglePerItem * 0.5);
    },
    [anglePerItem]
  );

  // Smooth Next / Prev button navigation
  const stepNext = () => {
    const current = targetRotationRef.current;
    const nextTarget = Math.floor(current / anglePerItem - 0.05) * anglePerItem;
    targetRotationRef.current = nextTarget;
  };

  const stepPrev = () => {
    const current = targetRotationRef.current;
    const prevTarget = Math.ceil(current / anglePerItem + 0.05) * anglePerItem;
    targetRotationRef.current = prevTarget;
  };

  const handleCardClick = (item: CircularGalleryItem, index: number) => {
    if (dragDistanceRef.current < 8) {
      onItemClick?.(item, index);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className={cn(
        'relative w-full h-[460px] sm:h-[500px] md:h-[530px] flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing',
        className
      )}
      style={{ perspective: '1600px' }}
      role="region"
      aria-label="Circular 3D Gallery"
    >
      {/* 3D Rotating Cylinder Carousel */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-auto"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg) rotateX(${bend * -1.5}deg)`,
        }}
      >
        {items.map((item, index) => {
          const itemAngle = index * anglePerItem;
          const radian = (itemAngle * Math.PI) / 180;
          const x = Math.sin(radian) * radius;
          const z = Math.cos(radian) * radius;

          // Compute angle relative to camera view
          const relAngle = (((itemAngle + rotation) % 360) + 360) % 360;
          const cosVal = Math.cos((relAngle * Math.PI) / 180);
          const isFront = cosVal > 0.02;
          const isCenterActive = cosVal > 0.88;

          return (
            <div
              key={item.id || index}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(item, index);
              }}
              className={cn(
                'absolute w-[165px] sm:w-[185px] md:w-[200px] h-[250px] sm:h-[280px] md:h-[305px] rounded-2xl cursor-pointer select-none',
                isCenterActive ? 'shadow-2xl' : 'shadow-md'
              )}
              style={{
                transformStyle: 'preserve-3d',
                transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${itemAngle}deg)`,
              }}
            >
              {/* Card Container with solid background preventing bleed-through */}
              <div
                className={cn(
                  'w-full h-full rounded-2xl overflow-hidden border transition-opacity duration-300 relative bg-stone-900',
                  isFront
                    ? 'border-white/20 opacity-100 shadow-xl'
                    : 'border-white/10 opacity-55 brightness-90 shadow-sm'
                )}
              >
                {/* When on the front hemisphere, show photo facing camera with non-bold text */}
                {isFront ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.title || item.text || `Gallery item ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />

                    {/* Clean Non-Bold Typography Overlay matching reference */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5 sm:p-4 pointer-events-none">
                      <h3 className="text-sm sm:text-base font-medium font-sans text-white tracking-normal drop-shadow-sm">
                        {item.title || item.text}
                      </h3>

                      {(item.subtitle || item.subtext) && (
                        <p className="text-[11px] sm:text-xs italic font-serif text-stone-300/90 mt-0.5 drop-shadow-sm">
                          {item.subtitle || item.subtext}
                        </p>
                      )}

                      {item.author && (
                        <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                          {item.author}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  /* When rotating through the background: flip image horizontally so it faces viewer upright, with NO text overlay (preventing mirrored text) */
                  <div className="w-full h-full relative" style={{ transform: 'scaleX(-1)' }}>
                    <img
                      src={item.image}
                      alt={item.title || item.text || `Gallery item ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Left / Right Navigation Buttons */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          stepPrev();
        }}
        className="absolute left-4 sm:left-8 z-30 p-3 sm:p-3.5 rounded-full bg-white/95 hover:bg-nature-accent hover:text-white text-zinc-900 border border-zinc-200 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center group"
        aria-label="Previous circular item"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          stepNext();
        }}
        className="absolute right-4 sm:right-8 z-30 p-3 sm:p-3.5 rounded-full bg-white/95 hover:bg-nature-accent hover:text-white text-zinc-900 border border-zinc-200 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center group"
        aria-label="Next circular item"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Subtle Bottom Ambient Gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-nature-dark via-nature-dark/40 to-transparent" />
    </div>
  );
};

export default CircularGallery;
