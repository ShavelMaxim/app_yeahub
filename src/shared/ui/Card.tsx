import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export const Card = ({ children, interactive, className = '', ...props }: CardProps) => (
  <div className={cn(styles.card, interactive && styles.interactive, className)} {...props}>
    {children}
  </div>
);
