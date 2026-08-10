import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name;
    const helpId = `${inputId}-help`;

    return (
      <label className={`field ${className}`} htmlFor={inputId}>
        <span className="field__label">{label}</span>
        <span className={`field__control ${error ? 'field__control--error' : ''}`}>
          {icon && <span className="field__icon">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? helpId : undefined}
            {...props}
          />
        </span>
        {(error || hint) && (
          <span id={helpId} className={error ? 'field__error' : 'field__hint'}>
            {error || hint}
          </span>
        )}
      </label>
    );
  },
);

Input.displayName = 'Input';
