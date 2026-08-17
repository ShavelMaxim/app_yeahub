import type { ReactNode } from 'react';
import { cn } from '@/shared/lib';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon = '◇',
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn(styles.emptyState, className)}>
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);
