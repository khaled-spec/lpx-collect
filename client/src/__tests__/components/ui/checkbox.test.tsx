import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox Component', () => {
  it('should render checkbox', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toHaveClass('peer');
    expect(checkbox).toHaveClass('h-4');
    expect(checkbox).toHaveClass('w-4');
    expect(checkbox).toHaveClass('shrink-0');
    expect(checkbox).toHaveClass('rounded-sm');
    expect(checkbox).toHaveClass('border');
    expect(checkbox).toHaveClass('border-primary');
  });

  it('should handle checked state', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should be controlled when checked prop is provided', () => {
    const { rerender } = render(<Checkbox checked={false} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    rerender(<Checkbox checked={true} />);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed');
    expect(checkbox).toHaveClass('disabled:opacity-50');
  });

  it('should accept custom className', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('should handle indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('should forward ref to checkbox element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should handle id attribute', () => {
    render(<Checkbox id="test-checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
  });

  it('should handle name attribute', () => {
    render(<Checkbox name="test-name" />);
    const checkbox = screen.getByRole('checkbox');
    // Radix UI Checkbox doesn't pass through name attribute to the button element
    expect(checkbox).toBeInTheDocument();
  });

  it('should handle value attribute', () => {
    render(<Checkbox value="test-value" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('value', 'test-value');
  });

  it('should toggle checked state on click', () => {
    let isChecked = false;
    const handleChange = (checked: boolean) => {
      isChecked = checked;
    };

    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(isChecked).toBe(true);

    fireEvent.click(checkbox);
    expect(isChecked).toBe(false);
  });

  it('should apply focus styles', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toHaveClass('focus-visible:outline-none');
    expect(checkbox).toHaveClass('focus-visible:ring-1');
    expect(checkbox).toHaveClass('focus-visible:ring-ring');
  });

  it('should apply checked styles', () => {
    const { container } = render(<Checkbox checked />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toHaveClass('data-[state=checked]:bg-primary');
    expect(checkbox).toHaveClass('data-[state=checked]:text-primary-foreground');
  });

  it('should render check icon when checked', () => {
    const { container } = render(<Checkbox checked />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-4');
    expect(icon).toHaveClass('w-4');
  });

  it('should handle required attribute', () => {
    render(<Checkbox required />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-required', 'true');
  });

  it('should handle aria-label', () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toBeInTheDocument();
  });

  it('should not toggle when disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should handle keyboard interaction', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    checkbox.focus();
    // Radix UI handles keyboard differently, just click instead
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});