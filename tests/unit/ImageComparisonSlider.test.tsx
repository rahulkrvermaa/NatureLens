import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageComparisonSlider } from '@/components/gallery/ImageComparisonSlider';

describe('ImageComparisonSlider Component', () => {
  it('renders both before and after images with labels', () => {
    render(
      <ImageComparisonSlider
        beforeImage="before.jpg"
        afterImage="after.jpg"
        beforeLabel="Raw Sensor"
        afterLabel="Master Grade"
        altBefore="Raw Exposure"
        altAfter="Master Exposure"
      />
    );
    expect(screen.getByText('Raw Sensor')).toBeInTheDocument();
    expect(screen.getByText('Master Grade')).toBeInTheDocument();
    expect(screen.getByAltText('Raw Exposure')).toBeInTheDocument();
    expect(screen.getByAltText('Master Exposure')).toBeInTheDocument();
  });
});
