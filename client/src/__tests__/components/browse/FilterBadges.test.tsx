import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilterBadges } from '@/components/browse/FilterBadges';
import { BrowseFilters } from '@/lib/browse-utils';

describe('FilterBadges Component', () => {
  const defaultFilters: BrowseFilters = {
    search: '',
    categories: [],
    conditions: [],
    rarities: [],
    priceRange: { min: 0, max: 10000 },
    vendors: [],
    tags: [],
    inStock: false,
    verified: false,
    featured: false,
    sortBy: 'featured',
    viewMode: 'grid',
  };

  const defaultProps = {
    filters: defaultFilters,
    onRemoveFilter: vi.fn(),
    onClearAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no filters are active', () => {
    const { container } = render(<FilterBadges {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render search filter badge', () => {
    const filters = { ...defaultFilters, search: 'Pikachu' };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Search: "Pikachu"')).toBeInTheDocument();
  });

  it('should render category filter badges', () => {
    const filters = { ...defaultFilters, categories: ['vintage', 'modern'] };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Vintage')).toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
  });

  it('should render condition filter badges', () => {
    const filters = { ...defaultFilters, conditions: ['mint', 'near-mint'] };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Mint')).toBeInTheDocument();
    expect(screen.getByText('Near Mint')).toBeInTheDocument();
  });

  it('should render rarity filter badges', () => {
    const filters = { ...defaultFilters, rarities: ['common', 'rare'] };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(screen.getByText('Rare')).toBeInTheDocument();
  });

  it('should render price range badge when min price is set', () => {
    const filters = { ...defaultFilters, priceRange: { min: 100, max: 10000 } };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('$100 - $10000')).toBeInTheDocument();
  });

  it('should render price range badge when max price is changed', () => {
    const filters = { ...defaultFilters, priceRange: { min: 0, max: 500 } };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('$0 - $500')).toBeInTheDocument();
  });

  it('should render vendor filter badges', () => {
    const filters = { ...defaultFilters, vendors: ['Vendor A', 'Vendor B'] };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Vendor: Vendor A')).toBeInTheDocument();
    expect(screen.getByText('Vendor: Vendor B')).toBeInTheDocument();
  });

  it('should render in stock badge when enabled', () => {
    const filters = { ...defaultFilters, inStock: true };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('should render verified badge when enabled', () => {
    const filters = { ...defaultFilters, verified: true };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('should render featured badge when enabled', () => {
    const filters = { ...defaultFilters, featured: true };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('should render tag filter badges', () => {
    const filters = { ...defaultFilters, tags: ['holographic', 'first-edition'] };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Tag: holographic')).toBeInTheDocument();
    expect(screen.getByText('Tag: first-edition')).toBeInTheDocument();
  });

  it('should call onRemoveFilter when badge is clicked', () => {
    const filters = { ...defaultFilters, search: 'test' };
    render(<FilterBadges {...defaultProps} filters={filters} />);

    const badge = screen.getByText('Search: "test"');
    fireEvent.click(badge);

    expect(defaultProps.onRemoveFilter).toHaveBeenCalledWith('search', 'test');
  });

  it('should call onRemoveFilter for category badges', () => {
    const filters = { ...defaultFilters, categories: ['vintage'] };
    render(<FilterBadges {...defaultProps} filters={filters} />);

    const badge = screen.getByText('Vintage');
    fireEvent.click(badge);

    expect(defaultProps.onRemoveFilter).toHaveBeenCalledWith('category', 'vintage');
  });

  it('should call onClearAll when Clear all button is clicked', () => {
    const filters = { ...defaultFilters, search: 'test', inStock: true };
    render(<FilterBadges {...defaultProps} filters={filters} />);

    const clearButton = screen.getByText('Clear all');
    fireEvent.click(clearButton);

    expect(defaultProps.onClearAll).toHaveBeenCalled();
  });

  it('should render multiple filter types together', () => {
    const filters = {
      ...defaultFilters,
      search: 'Charizard',
      categories: ['vintage'],
      conditions: ['mint'],
      priceRange: { min: 100, max: 1000 },
      inStock: true,
      verified: true,
    };

    render(<FilterBadges {...defaultProps} filters={filters} />);

    expect(screen.getByText('Search: "Charizard"')).toBeInTheDocument();
    expect(screen.getByText('Vintage')).toBeInTheDocument();
    expect(screen.getByText('Mint')).toBeInTheDocument();
    expect(screen.getByText('$100 - $1000')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('should display Active filters label', () => {
    const filters = { ...defaultFilters, search: 'test' };
    render(<FilterBadges {...defaultProps} filters={filters} />);
    expect(screen.getByText('Active filters:')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const filters = { ...defaultFilters, search: 'test' };
    const { container } = render(
      <FilterBadges {...defaultProps} filters={filters} className="custom-class" />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should have hover effects on badges', () => {
    const filters = { ...defaultFilters, search: 'test' };
    render(<FilterBadges {...defaultProps} filters={filters} />);

    const badge = screen.getByText('Search: "test"');
    expect(badge).toHaveClass('hover:bg-destructive');
    expect(badge).toHaveClass('hover:text-destructive-foreground');
  });

  it('should render filter icon', () => {
    const filters = { ...defaultFilters, search: 'test' };
    const { container } = render(<FilterBadges {...defaultProps} filters={filters} />);
    const filterIcon = container.querySelector('svg');
    expect(filterIcon).toBeInTheDocument();
  });

  it('should render X icon in badges', () => {
    const filters = { ...defaultFilters, search: 'test' };
    const { container } = render(<FilterBadges {...defaultProps} filters={filters} />);
    const xIcon = container.querySelector('svg.lucide-x');
    expect(xIcon).toBeInTheDocument();
  });

  it('should handle price filter removal', () => {
    const filters = { ...defaultFilters, priceRange: { min: 100, max: 500 } };
    render(<FilterBadges {...defaultProps} filters={filters} />);

    const badge = screen.getByText('$100 - $500');
    fireEvent.click(badge);

    expect(defaultProps.onRemoveFilter).toHaveBeenCalledWith('price', 'range');
  });

  it('should handle boolean filter removal', () => {
    const filters = { ...defaultFilters, inStock: true };
    render(<FilterBadges {...defaultProps} filters={filters} />);

    const badge = screen.getByText('In Stock');
    fireEvent.click(badge);

    expect(defaultProps.onRemoveFilter).toHaveBeenCalledWith('inStock', 'true');
  });
});