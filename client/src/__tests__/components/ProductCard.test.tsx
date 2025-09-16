import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductCard, ProductCardSkeleton } from '@/components/shared/ProductCard';
import { Product } from '@/lib/api/types';

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Charizard - Base Set',
  slug: 'charizard-base-set',
  description: 'A powerful fire-type Pokemon card',
  price: 5999.99,
  originalPrice: 7999.99,
  image: 'https://example.com/charizard.jpg',
  images: ['https://example.com/charizard.jpg'],
  category: {
    id: '1',
    name: 'Vintage',
    slug: 'vintage',
    description: 'Classic cards',
    icon: '🎴',
    productCount: 10
  },
  vendor: {
    id: '1',
    name: 'Elite Pokemon Cards',
    slug: 'elite-pokemon-cards',
    description: 'Premium vendor',
    logo: 'https://example.com/logo.jpg',
    rating: 4.8,
    totalSales: 1234,
    verified: true,
    joinedDate: '2023-01-01'
  },
  stock: 3,
  condition: 'mint',
  rarity: 'legendary',
  cardNumber: '4/102',
  featured: true,
  views: 1500,
  rating: 4.7,
  reviewCount: 23,
  tags: ['fire', 'starter'],
  specifications: {
    set: 'Base Set',
    year: '1999'
  },
  authenticity: {
    verified: true,
    grade: 'PSA 10',
    certificationNumber: 'ABC123'
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15'
};

describe('ProductCard', () => {
  const mockHandlers = {
    onQuickView: vi.fn(),
    onAddToCart: vi.fn(),
    onAddToWishlist: vi.fn(),
    onBuyNow: vi.fn(),
    onShare: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Grid View', () => {
    it('should render product information correctly', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);

      expect(screen.getByText('Charizard - Base Set')).toBeInTheDocument();
      expect(screen.getByText('Elite Pokemon Cards')).toBeInTheDocument();
      expect(screen.getByText('$6,000')).toBeInTheDocument();
      expect(screen.getByText('Vintage')).toBeInTheDocument();
    });

    it('should display featured badge when product is featured', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should display stock warning when stock is low', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);
      const stockWarnings = screen.getAllByText('Only 3 left');
      expect(stockWarnings.length).toBeGreaterThan(0);
      expect(stockWarnings[0]).toBeInTheDocument();
    });

    it('should display verified badge when authenticity is verified', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });

    it('should display condition and rarity badges', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);
      expect(screen.getByText('Mint')).toBeInTheDocument();
      expect(screen.getByText('Legendary')).toBeInTheDocument();
    });

    it('should handle add to cart click', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);

      const cartButtons = screen.getAllByRole('button');
      const cartButton = cartButtons.find(btn => btn.querySelector('.lucide-shopping-cart'));

      fireEvent.click(cartButton!);
      expect(mockHandlers.onAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle buy now click', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);

      const buttons = screen.getAllByRole('button');
      const buyButton = buttons.find(btn => btn.querySelector('.lucide-zap'));

      fireEvent.click(buyButton!);
      expect(mockHandlers.onBuyNow).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle wishlist click', () => {
      render(<ProductCard product={mockProduct} {...mockHandlers} />);

      const buttons = screen.getAllByRole('button');
      const wishlistButton = buttons.find(btn => btn.querySelector('.lucide-heart'));

      fireEvent.click(wishlistButton!);
      expect(mockHandlers.onAddToWishlist).toHaveBeenCalledWith(mockProduct);
    });

    it('should disable buttons when out of stock', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} {...mockHandlers} />);

      expect(screen.getByText('Out of Stock')).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      const cartButton = buttons.find(btn => btn.querySelector('.lucide-shopping-cart'));
      const buyButton = buttons.find(btn => btn.querySelector('.lucide-zap'));

      expect(cartButton).toBeDisabled();
      expect(buyButton).toBeDisabled();
    });

    it('should handle product with string category and vendor', () => {
      const stringProduct = {
        ...mockProduct,
        category: 'vintage',
        vendor: 'Elite Cards'
      };

      render(<ProductCard product={stringProduct as any} {...mockHandlers} />);

      expect(screen.getByText('vintage')).toBeInTheDocument();
      expect(screen.getByText('Elite Cards')).toBeInTheDocument();
    });
  });

  describe('List View', () => {
    it('should render in list view layout', () => {
      render(<ProductCard product={mockProduct} viewMode="list" {...mockHandlers} />);

      expect(screen.getByText('Charizard - Base Set')).toBeInTheDocument();
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });

    it('should show quick view button in list view', () => {
      render(<ProductCard product={mockProduct} viewMode="list" {...mockHandlers} />);

      expect(screen.getByText('Quick View')).toBeInTheDocument();

      const quickViewButton = screen.getByText('Quick View').closest('button');
      fireEvent.click(quickViewButton!);

      expect(mockHandlers.onQuickView).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle all action buttons in list view', () => {
      render(<ProductCard product={mockProduct} viewMode="list" {...mockHandlers} />);

      fireEvent.click(screen.getByText('Add to Cart'));
      expect(mockHandlers.onAddToCart).toHaveBeenCalledWith(mockProduct);

      fireEvent.click(screen.getByText('Buy Now'));
      expect(mockHandlers.onBuyNow).toHaveBeenCalledWith(mockProduct);

      const buttons = screen.getAllByRole('button');
      const shareButton = buttons.find(btn => btn.querySelector('.lucide-share2'));
      fireEvent.click(shareButton!);
      expect(mockHandlers.onShare).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('Compact View', () => {
    it('should render in compact view with reduced height', () => {
      const { container } = render(
        <ProductCard product={mockProduct} viewMode="compact" {...mockHandlers} />
      );

      const card = container.querySelector('.h-\\[360px\\]');
      expect(card).toBeInTheDocument();
    });

    it('should use smaller font sizes in compact view', () => {
      render(<ProductCard product={mockProduct} viewMode="compact" {...mockHandlers} />);

      const priceElement = screen.getByText('$6,000');
      expect(priceElement.className).toContain('text-xl');
    });
  });

  describe('Quick View', () => {
    it('should show quick view button on hover', () => {
      const { container } = render(
        <ProductCard product={mockProduct} showQuickView={true} {...mockHandlers} />
      );

      const card = container.querySelector('.group');
      fireEvent.mouseEnter(card!);

      // Quick view button should be visible on hover
      const buttons = screen.getAllByRole('button');
      const quickViewButton = buttons.find(btn => btn.querySelector('.lucide-eye'));

      expect(quickViewButton).toBeInTheDocument();
    });

    it('should not show quick view when disabled', () => {
      render(<ProductCard product={mockProduct} showQuickView={false} {...mockHandlers} />);

      const buttons = screen.getAllByRole('button');
      const quickViewButton = buttons.find(btn => btn.querySelector('.lucide-eye'));

      expect(quickViewButton).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle product without image gracefully', () => {
      const noImageProduct = { ...mockProduct, image: undefined, images: [] };
      render(<ProductCard product={noImageProduct} {...mockHandlers} />);

      // Should show placeholder icon
      const placeholder = document.querySelector('.lucide-package');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle product without optional fields', () => {
      const minimalProduct = {
        id: '1',
        name: 'Test Card',
        price: 99.99,
        category: 'test',
        vendor: 'Test Vendor',
        stock: 10
      };

      render(<ProductCard product={minimalProduct as any} {...mockHandlers} />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('should format high prices correctly', () => {
      const expensiveProduct = { ...mockProduct, price: 150000 };
      render(<ProductCard product={expensiveProduct} {...mockHandlers} />);

      expect(screen.getByText('$150,000')).toBeInTheDocument();
    });
  });
});

describe('ProductCardSkeleton', () => {
  it('should render skeleton in grid view', () => {
    const { container } = render(<ProductCardSkeleton />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render skeleton in list view', () => {
    const { container } = render(<ProductCardSkeleton viewMode="list" />);

    const card = container.querySelector('.flex');
    expect(card).toBeInTheDocument();

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render skeleton in compact view', () => {
    const { container } = render(<ProductCardSkeleton viewMode="compact" />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});