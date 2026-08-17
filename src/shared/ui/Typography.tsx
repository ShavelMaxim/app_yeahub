import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'headline1'
  | 'headline2'
  | 'headline3'
  | 'headline4'
  | 'headline5'
  | 'body1'
  | 'body1Accent'
  | 'body2'
  | 'body2Accent'
  | 'body2Strong'
  | 'body3'
  | 'body3Accent'
  | 'body3Strong'
  | 'body4'
  | 'body5'
  | 'body5Accent'
  | 'body5Caption'
  | 'body5Strong'
  | 'body6';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
  color?: 'inherit' | 'primary' | 'muted' | 'error' | 'success';
  children: ReactNode;
  truncate?: boolean;
}

const defaultElements: Record<TypographyVariant, ElementType> = {
  headline1: 'h1',
  headline2: 'h2',
  headline3: 'h3',
  headline4: 'h4',
  headline5: 'h5',
  body1: 'p',
  body1Accent: 'p',
  body2: 'p',
  body2Accent: 'p',
  body2Strong: 'p',
  body3: 'p',
  body3Accent: 'p',
  body3Strong: 'p',
  body4: 'p',
  body5: 'p',
  body5Accent: 'p',
  body5Caption: 'p',
  body5Strong: 'p',
  body6: 'p',
};

export const Typography = ({
  as,
  variant = 'body3',
  color = 'inherit',
  truncate = false,
  className,
  children,
  ...props
}: TypographyProps) => {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={cn(
        styles.typography,
        styles[variant],
        styles[color],
        truncate && styles.truncate,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
