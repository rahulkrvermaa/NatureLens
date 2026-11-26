import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MorphGallery from '@/components/ui/morph-gallery';
import { wrapIndex, coverScale, easeInOutQuint } from '@/components/ui/morph-gallery-utils';

describe('MorphGallery Helper Functions', () => {
  it('wrapIndex wraps correctly when loop is true', () => {
    expect(wrapIndex(0, 5, true)).toBe(0);
    expect(wrapIndex(5, 5, true)).toBe(0);
    expect(wrapIndex(-1, 5, true)).toBe(4);
    expect(wrapIndex(2, 5, true)).toBe(2);
  });

  it('wrapIndex clamps correctly when loop is false', () => {
    expect(wrapIndex(-2, 5, false)).toBe(0);
    expect(wrapIndex(10, 5, false)).toBe(4);
  });

  it('easeInOutQuint computes smooth curve', () => {
    expect(easeInOutQuint(0)).toBe(0);
    expect(easeInOutQuint(1)).toBe(1);
    expect(easeInOutQuint(0.5)).toBe(0.5);
  });

  it('coverScale computes proportional scales', () => {
    const [sx, sy] = coverScale(1.5, 1.5);
    expect(sx).toBe(1);
    expect(sy).toBe(1);
  });
});

describe('MorphGallery Component Rendering', () => {
  const items = [
    { src: 'https://example.com/photo1.jpg', alt: 'Photo 1' },
    { src: 'https://example.com/photo2.jpg', alt: 'Photo 2' },
  ];

  it('renders without crashing with arrows and region role', () => {
    render(<MorphGallery items={items} height="300px" arrows={true} />);
    expect(screen.getByRole('region', { name: /image gallery/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous image/i })).toBeInTheDocument();
  });
});
