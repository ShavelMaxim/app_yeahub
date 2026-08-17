import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  it('uses a semantic default element for the variant', () => {
    render(<Typography variant="headline2">Заголовок</Typography>);

    expect(screen.getByRole('heading', { level: 2, name: 'Заголовок' })).toBeInTheDocument();
  });

  it('allows overriding the rendered element', () => {
    render(
      <Typography as="span" variant="body2Strong">
        Подпись
      </Typography>,
    );

    expect(screen.getByText('Подпись').tagName).toBe('SPAN');
  });
});
