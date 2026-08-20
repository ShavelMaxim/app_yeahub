import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, endIcon, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name;
    const helpId = `${inputId}-help`;

    return (
      <label className={cn(styles.field, className)} htmlFor={inputId}>
        <span className={styles.label}>{label}</span>
        <span className={cn(styles.control, error && styles.controlError)}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? helpId : undefined}
            {...props}
          />
          {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
        </span>
        {(error || hint) && (
          <span id={helpId} className={error ? styles.error : styles.hint}>
            {error || hint}
          </span>
        )}
      </label>
    );
  },
);

Input.displayName = 'Input';
