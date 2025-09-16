import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('flex');
    expect(input).toHaveClass('h-9');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('border-input');
    expect(input).toHaveClass('bg-transparent');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-1');
  });

  it('should accept custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle different input types', () => {
    const { container } = render(<Input type="email" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test value');
  });

  it('should handle focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus test"
      />
    );
    const input = screen.getByPlaceholderText('Focus test');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should forward ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should accept and display value prop', () => {
    render(<Input value="initial value" readOnly />);
    const input = screen.getByDisplayValue('initial value');
    expect(input).toBeInTheDocument();
  });

  it('should handle required attribute', () => {
    const { container } = render(<Input required />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('required');
  });

  it('should handle name attribute', () => {
    const { container } = render(<Input name="username" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('should handle id attribute', () => {
    const { container } = render(<Input id="user-input" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('id', 'user-input');
  });

  it('should handle autoComplete attribute', () => {
    const { container } = render(<Input autoComplete="email" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it('should handle maxLength attribute', () => {
    const { container } = render(<Input maxLength={10} />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('should handle pattern attribute', () => {
    const { container } = render(<Input pattern="[0-9]*" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('pattern', '[0-9]*');
  });

  it('should apply focus styles', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('focus-visible:outline-none');
    expect(input).toHaveClass('focus-visible:ring-1');
    expect(input).toHaveClass('focus-visible:ring-ring');
  });

  it('should apply placeholder styles', () => {
    const { container } = render(<Input placeholder="Test" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('placeholder:text-muted-foreground');
  });

  it('should handle file input styles', () => {
    const { container } = render(<Input type="file" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('file:border-0');
    expect(input).toHaveClass('file:bg-transparent');
    expect(input).toHaveClass('file:text-sm');
    expect(input).toHaveClass('file:font-medium');
  });

  it('should handle readOnly attribute', () => {
    const { container } = render(<Input readOnly value="readonly" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('readOnly');
  });

  it('should handle aria attributes', () => {
    const { container } = render(
      <Input
        aria-label="Search"
        aria-describedby="search-description"
        aria-invalid="true"
      />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('aria-label', 'Search');
    expect(input).toHaveAttribute('aria-describedby', 'search-description');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});