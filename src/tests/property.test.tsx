import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../components/PropertyCard';

const mockProperty = {
  id: '123',
  unique_code: 'SKP-20251014-0001',
  name: 'Beautiful Villa',
  full_location: '123 Main Street, Kota',
  lat: 25.2138,
  lng: 75.8648,
  description: 'A beautiful villa with modern amenities',
  price: 5000000,
  area_sqft: 2500,
  property_type: 'Villa',
  ad_type: 'Sale',
  direction_facing: 'North',
  length: 50,
  breadth: 50,
  thumbnail_url: 'https://example.com/image.jpg',
  images: ['https://example.com/image1.jpg'],
  created_by: 'admin-id',
  deleted_at: null,
  created_at: '2025-10-14T00:00:00Z',
  updated_at: '2025-10-14T00:00:00Z',
};

describe('Property Components', () => {
  describe('PropertyCard', () => {
    it('should render property card with key information', () => {
      const onClick = vi.fn();
      render(<PropertyCard property={mockProperty} onClick={onClick} />);
      
      expect(screen.getByText('Beautiful Villa')).toBeInTheDocument();
      expect(screen.getByText(/123 Main Street, Kota/i)).toBeInTheDocument();
      expect(screen.getByText('Villa')).toBeInTheDocument();
      expect(screen.getByText(/2500 sq ft/i)).toBeInTheDocument();
    });

    it('should display price in formatted currency', () => {
      const onClick = vi.fn();
      render(<PropertyCard property={mockProperty} onClick={onClick} />);
      
      expect(screen.getByText(/50,00,000/)).toBeInTheDocument();
    });

    it('should display ad type badge', () => {
      const onClick = vi.fn();
      render(<PropertyCard property={mockProperty} onClick={onClick} />);
      
      expect(screen.getByText('Sale')).toBeInTheDocument();
    });

    it('should call onClick when card is clicked', () => {
      const onClick = vi.fn();
      const { container } = render(<PropertyCard property={mockProperty} onClick={onClick} />);
      
      const card = container.firstChild;
      if (card) {
        (card as HTMLElement).click();
        expect(onClick).toHaveBeenCalledWith(mockProperty);
      }
    });
  });
});
