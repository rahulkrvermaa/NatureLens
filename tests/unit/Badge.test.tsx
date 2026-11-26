import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/common/Badge';

describe('Badge Component', () => {
  it('renders badge content', () => {
    render(<Badge>Wildlife</Badge>);
    expect(screen.getByText('Wildlife')).toBeInTheDocument();
  });
});
