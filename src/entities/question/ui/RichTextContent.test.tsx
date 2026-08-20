import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RichTextContent } from './RichTextContent';

describe('RichTextContent', () => {
  it('renders editor HTML as formatted and safe content', () => {
    const { container } = render(
      <RichTextContent
        html={
          '<p><strong>Prop drilling</strong> — это передача данных.</p><pre><code>function App() { return &lt;Parent /&gt;; }</code></pre><script>unsafe()</script>'
        }
      />,
    );

    expect(screen.getByText('Prop drilling').tagName).toBe('STRONG');
    expect(container.querySelector('pre')).toHaveTextContent(
      'function App() { return <Parent />; }',
    );
    expect(screen.queryByText('unsafe()')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Скопировать код' })).toBeInTheDocument();
  });
});
