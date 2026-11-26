import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchModal } from '@/components/common/SearchModal';

describe('SearchModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <SearchModal isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders search input and suggestions when isOpen is true', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(/search photographs, biomes, photographers/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Popular:')).toBeInTheDocument();
  });

  it('filters results when user types a query', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search photographs, biomes, photographers/i);
    fireEvent.change(input, { target: { value: 'Dolomites' } });

    expect(screen.getByText(/Alpine Splendor at Tre Cime/i)).toBeInTheDocument();
  });

  it('invokes onClose when Escape is pressed', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });
});
