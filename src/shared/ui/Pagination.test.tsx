import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders the first pages and the last page like the design', () => {
    render(<Pagination currentPage={2} totalPages={24} onPageChange={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Страница 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Страница 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Страница 24' })).toBeInTheDocument();
  });

  it('changes the page with page and arrow buttons', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={2} totalPages={24} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Страница 5' }));
    await user.click(screen.getByRole('button', { name: 'Следующая страница' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 5);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('disables the previous arrow on the first page', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Предыдущая страница' })).toBeDisabled();
  });
});
