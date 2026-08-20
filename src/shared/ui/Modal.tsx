import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export const Modal = ({ open, title, children, onClose, footer }: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={titleId}>{title}</h2>
          <Button
            className={styles.closeButton}
            variant="ghost"
            size="small"
            aria-label="Закрыть окно"
            onClick={onClose}
          >
            ×
          </Button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
};
