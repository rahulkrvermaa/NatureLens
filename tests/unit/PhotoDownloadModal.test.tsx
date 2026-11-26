import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { DEMO_PHOTOS } from '@/lib/mockData';

describe('PhotoDownloadModal Component', () => {
  it('renders download resolution options when open', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <PhotoDownloadModal
          photo={DEMO_PHOTOS[0]}
          isOpen={true}
          onClose={handleClose}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Choose Download Resolution/i)).toBeInTheDocument();
    expect(screen.getByText('Original Master')).toBeInTheDocument();
    expect(screen.getByText('4K Wallpaper')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download High-Resolution Image/i })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <PhotoDownloadModal
          photo={DEMO_PHOTOS[0]}
          isOpen={false}
          onClose={handleClose}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Choose Download Resolution/i)).not.toBeInTheDocument();
  });
});
