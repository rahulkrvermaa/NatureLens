import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Lens } from '@/components/gallery/Lens';

describe('Lens Component', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('renders content correctly', () => {
    render(
      <Lens>
        <img src="test.jpg" alt="Nature Subject" />
      </Lens>
    );
    expect(screen.getByAltText('Nature Subject')).toBeInTheDocument();
  });

  it('renders controls toggle on fine-pointer devices', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <Lens showControls={true}>
        <img src="test.jpg" alt="Nature Subject" />
      </Lens>
    );
    expect(screen.getByRole('button', { name: /lens/i })).toBeInTheDocument();
  });

  it('disables lens controls on mobile / touch devices', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <Lens showControls={true}>
        <img src="test.jpg" alt="Nature Subject" />
      </Lens>
    );
    expect(screen.getByAltText('Nature Subject')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /lens/i })).not.toBeInTheDocument();
  });
});
