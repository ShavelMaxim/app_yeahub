interface SkeletonProps {
  lines?: number;
}

export const Skeleton = ({ lines = 3 }: SkeletonProps) => (
  <div className="skeleton" role="status" aria-label="Загрузка">
    {Array.from({ length: lines }, (_, index) => (
      <span key={index} style={{ width: index === lines - 1 ? '64%' : '100%' }} />
    ))}
  </div>
);
