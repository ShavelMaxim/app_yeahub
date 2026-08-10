import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export const Card = ({ children, interactive, className = '', ...props }: CardProps) => (
  <div className={`card ${interactive ? 'card--interactive' : ''} ${className}`} {...props}>
    {children}
  </div>
);
