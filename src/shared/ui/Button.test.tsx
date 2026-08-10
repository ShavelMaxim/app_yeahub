import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('calls the click handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Продолжить</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Продолжить' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled while loading', () => {
    render(<Button loading>Продолжить</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
