import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Lens } from '@/components/gallery/Lens';

describe('Lens Component', () => {
  it('renders content correctly', () => {
    render(
      <Lens>
        <img src="test.jpg" alt="Nature Subject" />
      </Lens>
    );
    expect(screen.getByAltText('Nature Subject')).toBeInTheDocument();
  });

  it('renders controls toggle', () => {
    render(
      <Lens showControls={true}>
        <img src="test.jpg" alt="Nature Subject" />
      </Lens>
    );
    expect(screen.getByRole('button', { name: /lens/i })).toBeInTheDocument();
  });
});
