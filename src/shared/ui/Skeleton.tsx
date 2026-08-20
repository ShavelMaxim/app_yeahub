import styles from './Skeleton.module.css';
import { cn } from '@/shared/lib';

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export const Skeleton = ({ lines = 3, className }: SkeletonProps) => (
  <div className={cn(styles.skeleton, className)} role="status" aria-label="Загрузка">
    {Array.from({ length: lines }, (_, index) => (
      <span key={index} style={{ width: index === lines - 1 ? '64%' : '100%' }} />
    ))}
  </div>
);
