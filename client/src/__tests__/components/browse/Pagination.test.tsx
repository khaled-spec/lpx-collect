import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from '@/components/browse/Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 120,
    itemsPerPage: 12,
    onPageChange: vi.fn(),
    onItemsPerPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render showing items text correctly', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Showing 1-12 of 120 items')).toBeInTheDocument();
  });

  it('should calculate correct item range for middle page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    expect(screen.getByText('Showing 49-60 of 120 items')).toBeInTheDocument();
  });

  it('should calculate correct item range for last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalItems={115} />);
    expect(screen.getByText('Showing 109-115 of 115 items')).toBeInTheDocument();
  });

  it('should render items per page selector', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Items per page:')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should call onItemsPerPageChange when selector changes', () => {
    render(<Pagination {...defaultProps} />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    const option24 = screen.getByText('24');
    fireEvent.click(option24);

    expect(defaultProps.onItemsPerPageChange).toHaveBeenCalledWith(24);
  });

  it('should render first page button', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const firstPageButtons = screen.getAllByRole('button');
    const firstPageButton = firstPageButtons.find(btn =>
      btn.querySelector('svg.lucide-chevrons-left')
    );
    expect(firstPageButton).toBeInTheDocument();
  });

  it('should disable first page button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const firstPageButtons = screen.getAllByRole('button');
    const firstPageButton = firstPageButtons.find(btn =>
      btn.querySelector('svg.lucide-chevrons-left')
    );
    expect(firstPageButton).toBeDisabled();
  });

  it('should call onPageChange(1) when first page clicked', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const firstPageButtons = screen.getAllByRole('button');
    const firstPageButton = firstPageButtons.find(btn =>
      btn.querySelector('svg.lucide-chevrons-left')
    );

    if (firstPageButton) {
      fireEvent.click(firstPageButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    }
  });

  it('should render previous page button', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const prevButtons = screen.getAllByRole('button');
    const prevButton = prevButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-left')
    );
    expect(prevButton).toBeInTheDocument();
  });

  it('should disable previous page button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const prevButtons = screen.getAllByRole('button');
    const prevButton = prevButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-left')
    );
    expect(prevButton).toBeDisabled();
  });

  it('should call onPageChange with previous page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const prevButtons = screen.getAllByRole('button');
    const prevButton = prevButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-left')
    );

    if (prevButton) {
      fireEvent.click(prevButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
    }
  });

  it('should render next page button', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const nextButtons = screen.getAllByRole('button');
    const nextButton = nextButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-right')
    );
    expect(nextButton).toBeInTheDocument();
  });

  it('should disable next page button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    const nextButtons = screen.getAllByRole('button');
    const nextButton = nextButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-right')
    );
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange with next page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const nextButtons = screen.getAllByRole('button');
    const nextButton = nextButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-right')
    );

    if (nextButton) {
      fireEvent.click(nextButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(6);
    }
  });

  it('should render last page button', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const lastPageButtons = screen.getAllByRole('button');
    const lastPageButton = lastPageButtons.find(btn =>
      btn.querySelector('svg.lucide-chevrons-right')
    );
    expect(lastPageButton).toBeInTheDocument();
  });

  it('should disable last page button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    const lastPageButtons = screen.getAllByRole('button');
    const lastPageButton = lastPageButtons.find(btn =>
      btn.querySelector('svg.lucide-chevrons-right')
    );
    expect(lastPageButton).toBeDisabled();
  });

  it('should call onPageChange with last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const lastPageButtons = screen.getAllByRole('button');
    const lastPageButton = lastPageButtons.find(btn =>
      btn.querySelector('svg.lucide-chevrons-right')
    );

    if (lastPageButton) {
      fireEvent.click(lastPageButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(10);
    }
  });

  it('should render all page numbers when total pages <= 7', () => {
    render(<Pagination {...defaultProps} totalPages={5} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render ellipsis when many pages', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(2);
  });

  it('should show ellipsis after first page when current > 3', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    const ellipses = screen.getAllByText('...');
    expect(ellipses[0]).toBeInTheDocument();
  });

  it('should show ellipsis before last page when current < totalPages - 2', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
    expect(screen.getByText('20')).toBeInTheDocument();
    const ellipses = screen.getAllByText('...');
    expect(ellipses[1]).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const pageButton = screen.getByRole('button', { name: '5' });
    expect(pageButton).toHaveClass('bg-primary');
  });

  it('should call onPageChange when page number clicked', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const pageButtons = screen.getAllByRole('button');
    const pageButton = pageButtons.find(btn => btn.textContent === '3');
    if (pageButton) {
      fireEvent.click(pageButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    }
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Pagination {...defaultProps} className="custom-class" />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should show correct pages around current page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should handle single page correctly', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={1} totalItems={10} />);
    expect(screen.getByText('Showing 1-10 of 10 items')).toBeInTheDocument();

    const prevButtons = screen.getAllByRole('button');
    const prevButton = prevButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-left')
    );
    const nextButton = prevButtons.find(btn =>
      btn.querySelector('svg.lucide-chevron-right')
    );

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('should render all items per page options', () => {
    render(<Pagination {...defaultProps} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // Check for the options in the dropdown
    const option24 = screen.getAllByText('24')[0];
    const option48 = screen.getAllByText('48')[0];
    const option96 = screen.getAllByText('96')[0];
    expect(option24).toBeInTheDocument();
    expect(option48).toBeInTheDocument();
    expect(option96).toBeInTheDocument();
  });
});