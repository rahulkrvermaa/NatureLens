import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CircularGallery } from '@/components/ui/circular-gallery';

describe('CircularGallery Component', () => {
  const items = [
    { image: 'https://example.com/1.jpg', title: 'Lion', subtitle: 'Panthera leo', author: 'Photo by: Clément Roy' },
    { image: 'https://example.com/2.jpg', title: 'Red panda', subtitle: 'Ailurus fulgens', author: 'Photo by: Niels Baars' },
    { image: 'https://example.com/3.jpg', title: 'Elephant', subtitle: 'Elephas maximus', author: 'Photo by: Alex Azabache' },
    { image: 'https://example.com/4.jpg', title: 'Polar bear', subtitle: 'Ursus maritimus', author: 'Photo by: Daniel Kordan' },
    { image: 'https://example.com/5.jpg', title: 'Snow leopard', subtitle: 'Panthera uncia', author: 'Photo by: Marcus Kiptoo' },
    { image: 'https://example.com/6.jpg', title: 'Giant panda', subtitle: 'Ailuropoda melanoleuca', author: 'Photo by: Pascal M' },
    { image: 'https://example.com/7.jpg', title: 'King penguin', subtitle: 'Aptenodytes patagonicus', author: 'Photo by: Martin Wettstein' },
    { image: 'https://example.com/8.jpg', title: 'Camel', subtitle: 'Camelus dromedarius', author: 'Photo by: Wolfgang Hasselmann' },
  ];

  it('renders region and portrait slides', () => {
    render(<CircularGallery items={items} autoplay={false} />);
    expect(screen.getByRole('region', { name: /circular 3d gallery/i })).toBeInTheDocument();
    expect(screen.getByText('Lion')).toBeInTheDocument();
    expect(screen.getByText('Panthera leo')).toBeInTheDocument();
    expect(screen.getByText('Red panda')).toBeInTheDocument();
    expect(screen.getByText('Ailurus fulgens')).toBeInTheDocument();
  });

  it('renders navigation buttons and allows clicking them', () => {
    render(<CircularGallery items={items} autoplay={false} />);
    const prevBtn = screen.getByRole('button', { name: /previous circular item/i });
    const nextBtn = screen.getByRole('button', { name: /next circular item/i });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    fireEvent.click(prevBtn);
  });

  it('triggers onItemClick when a card is clicked', () => {
    const handleItemClick = vi.fn();
    render(<CircularGallery items={items} autoplay={false} onItemClick={handleItemClick} />);

    const firstImage = screen.getAllByAltText('Lion')[0];
    fireEvent.click(firstImage.closest('.cursor-pointer')!);

    expect(handleItemClick).toHaveBeenCalledTimes(1);
    expect(handleItemClick).toHaveBeenCalledWith(items[0], 0);
  });
});
