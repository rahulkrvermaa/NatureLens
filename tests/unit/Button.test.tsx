import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/common/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Explore Gallery</Button>);
    expect(screen.getByRole('button', { name: /explore gallery/i })).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Action</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders loading state without clicking', () => {
    render(<Button isLoading>Submitting</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
