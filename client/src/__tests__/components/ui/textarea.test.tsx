import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea Component', () => {
  it('should render textarea element', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should apply default styles', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('flex');
    expect(textarea).toHaveClass('min-h-[60px]');
    expect(textarea).toHaveClass('w-full');
    expect(textarea).toHaveClass('rounded-md');
    expect(textarea).toHaveClass('border');
    expect(textarea).toHaveClass('border-input');
    expect(textarea).toHaveClass('bg-transparent');
    expect(textarea).toHaveClass('px-3');
    expect(textarea).toHaveClass('py-2');
  });

  it('should accept custom className', () => {
    const { container } = render(<Textarea className="custom-class" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    const textarea = screen.getByPlaceholderText('Disabled textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed');
    expect(textarea).toHaveClass('disabled:opacity-50');
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} placeholder="Type here" />);
    const textarea = screen.getByPlaceholderText('Type here');

    fireEvent.change(textarea, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('test value');
  });

  it('should handle focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <Textarea
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus test"
      />
    );
    const textarea = screen.getByPlaceholderText('Focus test');

    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should forward ref to textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should accept and display value prop', () => {
    render(<Textarea value="initial value" readOnly />);
    const textarea = screen.getByDisplayValue('initial value');
    expect(textarea).toBeInTheDocument();
  });

  it('should handle required attribute', () => {
    const { container } = render(<Textarea required />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('required');
  });

  it('should handle name attribute', () => {
    const { container } = render(<Textarea name="description" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('name', 'description');
  });

  it('should handle id attribute', () => {
    const { container } = render(<Textarea id="user-textarea" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('id', 'user-textarea');
  });

  it('should handle rows attribute', () => {
    const { container } = render(<Textarea rows={5} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should handle cols attribute', () => {
    const { container } = render(<Textarea cols={30} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('cols', '30');
  });

  it('should handle maxLength attribute', () => {
    const { container } = render(<Textarea maxLength={100} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('should apply focus styles', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('focus-visible:outline-none');
    expect(textarea).toHaveClass('focus-visible:ring-1');
    expect(textarea).toHaveClass('focus-visible:ring-ring');
  });

  it('should apply placeholder styles', () => {
    const { container } = render(<Textarea placeholder="Test" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('placeholder:text-muted-foreground');
  });

  it('should handle readOnly attribute', () => {
    const { container } = render(<Textarea readOnly value="readonly" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('should handle autoComplete attribute', () => {
    const { container } = render(<Textarea autoComplete="off" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('autoComplete', 'off');
  });

  it('should handle aria attributes', () => {
    const { container } = render(
      <Textarea
        aria-label="Comments"
        aria-describedby="comments-description"
        aria-invalid="true"
      />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('aria-label', 'Comments');
    expect(textarea).toHaveAttribute('aria-describedby', 'comments-description');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('should handle multiline text input', () => {
    render(<Textarea placeholder="Multiline" />);
    const textarea = screen.getByPlaceholderText('Multiline');

    const multilineText = 'Line 1\nLine 2\nLine 3';
    fireEvent.change(textarea, { target: { value: multilineText } });
    expect(textarea).toHaveValue(multilineText);
  });

  it('should handle resize style', () => {
    const { container } = render(<Textarea style={{ resize: 'none' }} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveStyle({ resize: 'none' });
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn();
    render(<Textarea onKeyDown={handleKeyDown} placeholder="Type here" />);
    const textarea = screen.getByPlaceholderText('Type here');

    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalled();
  });
});