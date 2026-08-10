import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon = '◇', title, description, action }: EmptyStateProps) => (
  <div className="empty-state">
    <span className="empty-state__icon" aria-hidden="true">
      {icon}
    </span>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);
