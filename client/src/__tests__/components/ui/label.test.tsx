import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('should render label with text', () => {
    render(<Label>Label Text</Label>);
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    const { container } = render(<Label>Default Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
    expect(label).toHaveClass('leading-none');
  });

  it('should accept custom className', () => {
    const { container } = render(<Label className="custom-class">Custom</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('custom-class');
  });

  it('should handle htmlFor attribute', () => {
    const { container } = render(<Label htmlFor="input-id">Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('should forward ref to label element', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('should render children elements', () => {
    render(
      <Label>
        <span>Icon</span>
        <span>Text</span>
      </Label>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should apply peer disabled styles', () => {
    const { container } = render(<Label>Disabled Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });

  it('should handle id attribute', () => {
    const { container } = render(<Label id="label-id">Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('id', 'label-id');
  });

  it('should handle onClick events', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    render(<Label onClick={handleClick}>Clickable Label</Label>);
    const label = screen.getByText('Clickable Label');
    label.click();
    expect(clicked).toBe(true);
  });

  it('should work with form inputs', () => {
    render(
      <>
        <Label htmlFor="test-input">Input Label</Label>
        <input id="test-input" type="text" />
      </>
    );
    const label = screen.getByText('Input Label');
    const input = screen.getByRole('textbox');

    // Just verify they're linked
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('should handle aria attributes', () => {
    const { container } = render(
      <Label
        aria-label="Accessible Label"
        aria-describedby="label-description"
      >
        Label Text
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('aria-label', 'Accessible Label');
    expect(label).toHaveAttribute('aria-describedby', 'label-description');
  });

  it('should handle data attributes', () => {
    const { container } = render(
      <Label data-testid="test-label" data-value="test">
        Data Label
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('data-testid', 'test-label');
    expect(label).toHaveAttribute('data-value', 'test');
  });

  it('should maintain text styles', () => {
    const { container } = render(<Label>Styled Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
    expect(label).toHaveClass('leading-none');
  });

  it('should merge custom styles with default styles', () => {
    const { container } = render(
      <Label className="text-lg text-blue-500">
        Custom Styled Label
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveClass('text-lg');
    expect(label).toHaveClass('text-blue-500');
    expect(label).toHaveClass('font-medium');
  });

  it('should handle nested content', () => {
    render(
      <Label>
        <strong>Required</strong> Field
      </Label>
    );
    const strong = screen.getByText('Required');
    expect(strong.tagName).toBe('STRONG');
    expect(screen.getByText(/Field/)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(
      <Label htmlFor="accessible-input">
        Accessible Label
      </Label>
    );
    const label = screen.getByText('Accessible Label');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'accessible-input');
  });

  it('should handle style prop', () => {
    const { container } = render(
      <Label style={{ color: 'red', fontSize: '16px' }}>
        Inline Styled Label
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveStyle({ color: 'red', fontSize: '16px' });
  });

  it('should handle title attribute', () => {
    const { container } = render(
      <Label title="This is a tooltip">
        Label with Tooltip
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('title', 'This is a tooltip');
  });
});