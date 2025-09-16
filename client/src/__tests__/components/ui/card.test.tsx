import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

describe('Card Component', () => {
  it('should render card with content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply default card styles', () => {
    const { container } = render(<Card>Default Card</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('shadow');
  });

  it('should accept custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('should forward additional props', () => {
    render(<Card data-testid="test-card">Props Test</Card>);
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(<Card>Div Card</Card>);
    const card = container.firstChild;
    expect(card?.nodeName).toBe('DIV');
  });
});

describe('CardHeader Component', () => {
  it('should render header with content', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should apply default header styles', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild;
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Custom</CardHeader>);
    const header = container.firstChild;
    expect(header).toHaveClass('custom-header');
  });

  it('should render as a div element', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild;
    expect(header?.nodeName).toBe('DIV');
  });
});

describe('CardTitle Component', () => {
  it('should render title with text', () => {
    render(<CardTitle>Card Title</CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should apply default title styles', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild;
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('leading-none');
    expect(title).toHaveClass('tracking-tight');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardTitle className="text-xl">Custom Title</CardTitle>);
    const title = container.firstChild;
    expect(title).toHaveClass('text-xl');
  });

  it('should render as a div element', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild;
    expect(title?.nodeName).toBe('DIV');
  });
});

describe('CardDescription Component', () => {
  it('should render description with text', () => {
    render(<CardDescription>Card Description</CardDescription>);
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('should apply default description styles', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.firstChild;
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardDescription className="text-base">Custom</CardDescription>);
    const description = container.firstChild;
    expect(description).toHaveClass('text-base');
  });

  it('should render as a div element', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.firstChild;
    expect(description?.nodeName).toBe('DIV');
  });
});

describe('CardContent Component', () => {
  it('should render content', () => {
    render(<CardContent>Content text</CardContent>);
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('should apply default content styles', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild;
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardContent className="p-4">Custom</CardContent>);
    const content = container.firstChild;
    expect(content).toHaveClass('p-4');
  });

  it('should render as a div element', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild;
    expect(content?.nodeName).toBe('DIV');
  });
});

describe('CardFooter Component', () => {
  it('should render footer with content', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should apply default footer styles', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild;
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardFooter className="justify-end">Custom</CardFooter>);
    const footer = container.firstChild;
    expect(footer).toHaveClass('justify-end');
  });

  it('should render as a div element', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild;
    expect(footer?.nodeName).toBe('DIV');
  });
});

describe('Card Composition', () => {
  it('should render complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Test Content</p>
        </CardContent>
        <CardFooter>
          <button>Test Button</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should maintain proper component hierarchy', () => {
    const { container } = render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Title</CardTitle>
        </CardHeader>
        <CardContent data-testid="content">Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('card');
    const header = screen.getByTestId('header');
    const title = screen.getByTestId('title');
    const content = screen.getByTestId('content');

    expect(card).toContainElement(header);
    expect(card).toContainElement(content);
    expect(header).toContainElement(title);
  });
});