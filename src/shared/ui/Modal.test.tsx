import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders an accessible dialog when open', () => {
    render(
      <Modal open title="Подтверждение" onClose={() => undefined}>
        Содержимое
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Подтверждение' })).toBeInTheDocument();
    expect(screen.getByText('Содержимое')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Подтверждение" onClose={onClose}>
        Содержимое
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
