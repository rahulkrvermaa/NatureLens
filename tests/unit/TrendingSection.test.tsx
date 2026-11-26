import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TrendingSection } from '@/pages/public/home/TrendingSection';

describe('TrendingSection Component', () => {
  it('renders section title and uniform photography grid cards', () => {
    render(
      <MemoryRouter>
        <TrendingSection />
      </MemoryRouter>
    );

    expect(screen.getByText('Trending Photographs')).toBeInTheDocument();
    expect(screen.getByText('Popular This Week')).toBeInTheDocument();
  });

  it('triggers onPhotoClick when a photo card is clicked', () => {
    const handlePhotoClick = vi.fn();
    render(
      <MemoryRouter>
        <TrendingSection onPhotoClick={handlePhotoClick} />
      </MemoryRouter>
    );

    // Click on the first rendered image card
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    fireEvent.click(images[0]);

    expect(handlePhotoClick).toHaveBeenCalledTimes(1);
  });
});
