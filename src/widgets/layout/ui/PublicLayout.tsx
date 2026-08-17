import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '@/shared/ui';
import hamburgerIcon from '@/shared/config/assets/icons/hamburgerMenu.svg';
import { Footer } from './Footer';
import styles from './PublicLayout.module.css';

export const PublicLayout = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div className={styles.shell}>
      <header
        className={`${styles.header} ${isLanding ? styles.landingHeader : styles.compactHeader}`}
      >
        <div className={styles.headerInner}>
          <Logo variant="primary" />
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Открыть меню"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <img src={hamburgerIcon} alt="" />
          </button>
          <div className={`${styles.navigation} ${open ? styles.navigationOpen : ''}`}>
            {!isLanding && (
              <nav aria-label="Основная навигация">
                <NavLink to="/questions" onClick={() => setOpen(false)}>
                  База вопросов
                </NavLink>
                <NavLink to="/trainer" onClick={() => setOpen(false)}>
                  Тренажёр
                </NavLink>
              </nav>
            )}
            <div className={styles.authActions}>
              <Link to="/login" onClick={() => setOpen(false)}>
                Вход
              </Link>
              <Link className={styles.register} to="/register" onClick={() => setOpen(false)}>
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
