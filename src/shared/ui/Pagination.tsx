import arrowLeft from '@/shared/config/assets/icons/arrowLeftBtn.svg';
import arrowRight from '@/shared/config/assets/icons/arrowRightBtn.svg';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

const getPaginationItems = (currentPage: number, totalPages: number): PaginationItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 6, 'ellipsis-right', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-left', ...Array.from({ length: 6 }, (_, index) => totalPages - 5 + index)];
  }

  return [
    1,
    'ellipsis-left',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-right',
    totalPages,
  ];
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const items = getPaginationItems(safeCurrentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        className={styles.arrowButton}
        type="button"
        disabled={safeCurrentPage === 1}
        onClick={() => onPageChange(safeCurrentPage - 1)}
        aria-label="Предыдущая страница"
      >
        <img src={arrowLeft} alt="" aria-hidden="true" />
      </button>

      <div className={styles.pages}>
        {items.map((item) =>
          typeof item === 'number' ? (
            <button
              className={`${styles.pageButton} ${item === safeCurrentPage ? styles.active : ''}`}
              type="button"
              key={item}
              onClick={() => onPageChange(item)}
              aria-label={`Страница ${item}`}
              aria-current={item === safeCurrentPage ? 'page' : undefined}
            >
              {item}
            </button>
          ) : (
            <span className={styles.ellipsis} key={item} aria-hidden="true">
              ...
            </span>
          ),
        )}
      </div>

      <button
        className={styles.arrowButton}
        type="button"
        disabled={safeCurrentPage === totalPages}
        onClick={() => onPageChange(safeCurrentPage + 1)}
        aria-label="Следующая страница"
      >
        <img src={arrowRight} alt="" aria-hidden="true" />
      </button>
    </nav>
  );
}
