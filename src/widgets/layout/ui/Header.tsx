import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCredentials, useAuth, useLogoutMutation } from '@/features/auth';
import { baseApi } from '@/shared/api';
import { Logo } from '@/shared/ui';
import sendSquareLeft from '@/shared/config/assets/icons/sendSquareLeft.svg';
import accountArrowIcon from '@/shared/config/assets/icons/arrowMenuDown.svg';
import styles from './Header.module.css';

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ collapsed, onToggleSidebar }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, user } = useAuth();
  const [logoutRequest] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const logout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // Local logout must still work when the API is temporarily unavailable.
    }
    dispatch(clearCredentials());
    dispatch(baseApi.util.resetApiState());
    closeMenu();
    navigate('/login', { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.brandArea}>
        <Logo />
        <button
          className={styles.sidebarToggle}
          type="button"
          aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
          aria-expanded={!collapsed}
          onClick={onToggleSidebar}
        >
          <img
            className={collapsed ? styles.sidebarArrowExpanded : styles.sidebarArrow}
            src={sendSquareLeft}
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={styles.accountArea}>
        <span className={styles.membership}>Free</span>
        {token ? (
          <div className={styles.accountMenu}>
            <button
              className={styles.accountButton}
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span>{user?.username ?? 'Профиль'}</span>
              <img
                className={`${styles.accountArrow} ${menuOpen ? styles.accountArrowOpen : ''}`}
                src={accountArrowIcon}
                alt=""
                aria-hidden="true"
              />
              <span className={styles.avatar}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" />
                ) : (
                  (user?.username?.[0]?.toUpperCase() ?? 'U')
                )}
              </span>
            </button>
            {menuOpen && (
              <div className={styles.popover}>
                <strong>{user?.username ?? 'Пользователь'}</strong>
                <span>{user?.email}</span>
                <Link to="/profile" onClick={closeMenu}>
                  Мой профиль
                </Link>
                <Link to="/profile/edit" onClick={closeMenu}>
                  Настройки
                </Link>
                <button type="button" onClick={logout}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.login} type="button" onClick={() => navigate('/login')}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
};
