import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearCredentials, useAuth, useLogoutMutation } from '@/features/auth';
import { baseApi } from '@/shared/api';
import { hasAdminRole } from '@/shared/lib';
import { Button, Logo } from '@/shared/ui';

export const Header = () => {
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
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <button
          className="menu-toggle"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}
          aria-label="Основная навигация"
        >
          <NavLink to="/questions" onClick={closeMenu}>
            База вопросов
          </NavLink>
          <NavLink to="/trainer" onClick={closeMenu}>
            Тренажёр
          </NavLink>
          {token && (
            <NavLink to="/dashboard" onClick={closeMenu}>
              Дашборд
            </NavLink>
          )}
          {token && hasAdminRole(user?.userRoles) && (
            <NavLink to="/admin" onClick={closeMenu}>
              Админка
            </NavLink>
          )}
          <div className="site-nav__actions">
            {token ? (
              <>
                <NavLink className="profile-link" to="/profile" onClick={closeMenu}>
                  <span className="avatar avatar--small">
                    {user?.username?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                  {user?.username ?? 'Профиль'}
                </NavLink>
                <Button variant="ghost" size="small" onClick={logout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>
                  Войти
                </NavLink>
                <Button size="small" onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
