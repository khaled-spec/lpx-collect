import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmptyState, { EmptyStates } from '@/components/shared/EmptyState';
import { Package, ShoppingCart, Heart } from 'lucide-react';

describe('EmptyState Component', () => {
  const defaultProps = {
    icon: Package,
    title: 'No items found',
    description: 'Try adjusting your filters',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render icon, title and description', () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();

    const { container } = render(<EmptyState {...defaultProps} />);
    const icon = container.querySelector('svg.lucide-package');
    expect(icon).toBeInTheDocument();
  });

  it('should render without description', () => {
    render(<EmptyState icon={Package} title="No items" />);
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('should render action button with onClick', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        {...defaultProps}
        actionLabel="Try Again"
        onAction={handleAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Try Again' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('should render action button as link', () => {
    render(
      <EmptyState
        {...defaultProps}
        actionLabel="Browse Products"
        actionHref="/browse"
      />
    );

    const link = screen.getByRole('link', { name: 'Browse Products' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/browse');
  });

  it('should render secondary action button with onClick', () => {
    const handleSecondary = vi.fn();
    render(
      <EmptyState
        {...defaultProps}
        secondaryActionLabel="Cancel"
        onSecondaryAction={handleSecondary}
      />
    );

    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });

  it('should render secondary action button as link', () => {
    render(
      <EmptyState
        {...defaultProps}
        secondaryActionLabel="Go Back"
        secondaryActionHref="/home"
      />
    );

    const link = screen.getByRole('link', { name: 'Go Back' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });

  it('should render both primary and secondary actions', () => {
    render(
      <EmptyState
        {...defaultProps}
        actionLabel="Primary"
        actionHref="/primary"
        secondaryActionLabel="Secondary"
        secondaryActionHref="/secondary"
      />
    );

    expect(screen.getByRole('link', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Secondary' })).toBeInTheDocument();
  });

  it('should apply small size styles', () => {
    const { container } = render(
      <EmptyState {...defaultProps} size="sm" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-8');

    const title = screen.getByText('No items found');
    expect(title).toHaveClass('text-lg');
  });

  it('should apply medium size styles (default)', () => {
    const { container } = render(
      <EmptyState {...defaultProps} size="md" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-12');

    const title = screen.getByText('No items found');
    expect(title).toHaveClass('text-xl');
  });

  it('should apply large size styles', () => {
    const { container } = render(
      <EmptyState {...defaultProps} size="lg" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-16');

    const title = screen.getByText('No items found');
    expect(title).toHaveClass('text-2xl');
  });

  it('should render default variant', () => {
    const { container } = render(
      <EmptyState {...defaultProps} variant="default" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('text-center');
    expect(wrapper?.nodeName).toBe('DIV');
  });

  it('should render card variant', () => {
    render(
      <EmptyState {...defaultProps} variant="card" />
    );

    // Card variant wraps content in Card component
    const cards = document.querySelectorAll('[class*="rounded"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render minimal variant', () => {
    const { container } = render(
      <EmptyState {...defaultProps} variant="minimal" />
    );

    const iconWrapper = container.querySelector('.bg-transparent');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <EmptyState {...defaultProps} className="custom-class" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should apply custom icon className', () => {
    const { container } = render(
      <EmptyState {...defaultProps} iconClassName="text-blue-500" />
    );

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('text-blue-500');
  });

  it('should render children content', () => {
    render(
      <EmptyState {...defaultProps}>
        <div>Additional content</div>
      </EmptyState>
    );

    expect(screen.getByText('Additional content')).toBeInTheDocument();
  });

  describe('Pre-built EmptyStates', () => {
    it('should render NoProducts empty state', () => {
      render(<EmptyStates.NoProducts />);
      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your filters/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Browse All Products' })).toHaveAttribute('href', '/browse');
    });

    it('should render EmptyCart empty state', () => {
      render(<EmptyStates.EmptyCart />);
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText(/haven't added any items/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Browse Collection' })).toHaveAttribute('href', '/browse');
    });

    it('should render NoOrders empty state', () => {
      render(<EmptyStates.NoOrders />);
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
      expect(screen.getByText(/haven't placed any orders/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Start Shopping' })).toHaveAttribute('href', '/browse');
    });

    it('should render NoWishlistItems empty state', () => {
      render(<EmptyStates.NoWishlistItems />);
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
      expect(screen.getByText(/Save items you love/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Explore Products' })).toHaveAttribute('href', '/browse');
    });

    it('should render NoNotifications empty state', () => {
      render(<EmptyStates.NoNotifications />);
      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(screen.getByText(/You're all caught up/)).toBeInTheDocument();
    });

    it('should render NoSearchResults with query', () => {
      const handleClear = vi.fn();
      render(
        <EmptyStates.NoSearchResults query="Pikachu" onClear={handleClear} />
      );

      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText(/No results found for "Pikachu"/)).toBeInTheDocument();

      const clearButton = screen.getByRole('button', { name: 'Clear Search' });
      fireEvent.click(clearButton);
      expect(handleClear).toHaveBeenCalledTimes(1);

      expect(screen.getByRole('link', { name: 'Browse All' })).toHaveAttribute('href', '/browse');
    });

    it('should render NoSearchResults without query', () => {
      render(<EmptyStates.NoSearchResults />);
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument();
    });

    it('should render Error empty state', () => {
      const handleRetry = vi.fn();
      render(<EmptyStates.Error onRetry={handleRetry} />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/encountered an error/)).toBeInTheDocument();

      const retryButton = screen.getByRole('button', { name: 'Try Again' });
      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should render NoVendors empty state', () => {
      render(<EmptyStates.NoVendors />);
      expect(screen.getByText('No vendors found')).toBeInTheDocument();
      expect(screen.getByText(/adjusting your filters/)).toBeInTheDocument();
    });

    it('should render NoAddresses empty state', () => {
      render(<EmptyStates.NoAddresses />);
      expect(screen.getByText('No shipping addresses saved')).toBeInTheDocument();
      expect(screen.getByText(/Add a shipping address/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Address' })).toBeInTheDocument();
    });

    it('should render NoPaymentMethods empty state', () => {
      render(<EmptyStates.NoPaymentMethods />);
      expect(screen.getByText('No payment methods')).toBeInTheDocument();
      expect(screen.getByText(/Add a payment method/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Payment Method' })).toBeInTheDocument();
    });

    it('should render NoVendorProducts empty state', () => {
      render(<EmptyStates.NoVendorProducts />);
      expect(screen.getByText('No products yet')).toBeInTheDocument();
      expect(screen.getByText(/Start listing your products/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Add Your First Product' })).toHaveAttribute('href', '/vendor/products');
    });

    it('should render EmptyNotifications with unread filter', () => {
      render(<EmptyStates.EmptyNotifications showUnreadOnly={true} />);
      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(screen.getByText(/don't have any unread notifications/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show All Notifications' })).toBeInTheDocument();
    });

    it('should render EmptyNotifications with filter type', () => {
      render(<EmptyStates.EmptyNotifications filterType="orders" />);
      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(screen.getByText(/No orders notifications to show/)).toBeInTheDocument();
    });

    it('should render NoVendorInfo empty state', () => {
      render(<EmptyStates.NoVendorInfo />);
      expect(screen.getByText('Vendor not found')).toBeInTheDocument();
      expect(screen.getByText(/vendor you're looking for/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Browse All Vendors' })).toHaveAttribute('href', '/vendors');
    });

    it('should allow overriding props in pre-built states', () => {
      render(
        <EmptyStates.NoProducts
          title="Custom Title"
          description="Custom Description"
          actionLabel="Custom Action"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Custom Action' })).toBeInTheDocument();
    });
  });
});