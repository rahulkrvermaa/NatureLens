import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WallpaperGridCard } from '@/components/gallery/WallpaperGridCard';
import { DEMO_PHOTOS } from '@/lib/mockData';

describe('WallpaperGridCard Component', () => {
  it('renders photo and caption text matching reference format', () => {
    const handleClick = vi.fn();
    render(<WallpaperGridCard photo={DEMO_PHOTOS[0]} onClick={handleClick} />);

    expect(screen.getByAltText(DEMO_PHOTOS[0].title)).toBeInTheDocument();
    expect(screen.getByText(/Aurora Borealis Over Senja Fjords/i)).toBeInTheDocument();
  });

  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<WallpaperGridCard photo={DEMO_PHOTOS[0]} onClick={handleClick} />);

    fireEvent.click(screen.getByText(/Aurora Borealis Over Senja Fjords/i));
    expect(handleClick).toHaveBeenCalledWith(DEMO_PHOTOS[0]);
  });
});
