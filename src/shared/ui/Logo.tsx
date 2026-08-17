import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib';
import logoMark from '@/shared/config/assets/icons/logoPrimary.svg';
import logoSecondary from '@/shared/config/assets/icons/logoSecondary.svg';
import yeahubWordmark from '@/shared/config/assets/icons/Yeahub.svg';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'primary' | 'secondary' | 'wordmark';
  size?: 'default' | 'large';
  showWordmarkOnMobile?: boolean;
  showMarkOnMobile?: boolean;
}

export const Logo = ({
  variant = 'primary',
  size = 'default',
  showWordmarkOnMobile = false,
  showMarkOnMobile = false,
}: LogoProps) => (
  <Link
    to="/"
    className={cn(
      styles.logo,
      variant === 'wordmark' && styles.wordmarkOnly,
      size === 'large' && styles.large,
      showWordmarkOnMobile && styles.forceWordmark,
      showMarkOnMobile && styles.forceMark,
    )}
    aria-label="YeaHub — на главную"
  >
    <span
      className={cn(styles.mark, variant === 'secondary' && styles.markSecondary)}
      aria-hidden="true"
    >
      <img src={variant === 'secondary' ? logoSecondary : logoMark} alt="" />
    </span>
    <img className={styles.wordmark} src={yeahubWordmark} alt="" aria-hidden="true" />
  </Link>
);
