import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button, buttonVariants } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should apply default variant styles', () => {
    const { container } = render(<Button>Default</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('should apply destructive variant styles', () => {
    const { container } = render(<Button variant="destructive">Destructive</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  it('should apply outline variant styles', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
    expect(button).toHaveClass('bg-background');
  });

  it('should apply secondary variant styles', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  it('should apply ghost variant styles', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('hover:bg-accent');
    expect(button).toHaveClass('hover:text-accent-foreground');
  });

  it('should apply link variant styles', () => {
    const { container } = render(<Button variant="link">Link</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('underline-offset-4');
  });

  it('should apply default size styles', () => {
    const { container } = render(<Button>Default Size</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('should apply small size styles', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('text-xs');
  });

  it('should apply large size styles', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-8');
  });

  it('should apply icon size styles', () => {
    const { container } = render(<Button size="icon" aria-label="Icon button">🔍</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('w-9');
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should accept custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.firstChild;
    expect(button).toHaveClass('custom-class');
  });

  it('should forward additional props', () => {
    render(<Button data-testid="test-button">Props Test</Button>);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  it('should handle onClick events', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    button.click();
    expect(clicked).toBe(true);
  });

  it('should render children elements', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  describe('buttonVariants function', () => {
    it('should return default variant classes', () => {
      const classes = buttonVariants();
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should return destructive variant classes', () => {
      const classes = buttonVariants({ variant: 'destructive' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-destructive-foreground');
    });

    it('should return outline variant classes', () => {
      const classes = buttonVariants({ variant: 'outline' });
      expect(classes).toContain('border');
      expect(classes).toContain('border-input');
    });

    it('should return small size classes', () => {
      const classes = buttonVariants({ size: 'sm' });
      expect(classes).toContain('h-8');
      expect(classes).toContain('px-3');
    });

    it('should return large size classes', () => {
      const classes = buttonVariants({ size: 'lg' });
      expect(classes).toContain('h-10');
      expect(classes).toContain('px-8');
    });

    it('should combine variant and size classes', () => {
      const classes = buttonVariants({ variant: 'secondary', size: 'lg' });
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('h-10');
    });
  });
});