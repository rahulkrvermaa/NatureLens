import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TiltCard } from '@/components/gallery/TiltCard';

describe('TiltCard Component', () => {
  it('renders children with 3D wrapper', () => {
    render(
      <TiltCard>
        <div>Tactile Photo Card</div>
      </TiltCard>
    );
    expect(screen.getByText('Tactile Photo Card')).toBeInTheDocument();
  });
});
