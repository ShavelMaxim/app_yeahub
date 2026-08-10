import { Link } from 'react-router-dom';
import { Logo } from '@/shared/ui';

export const Footer = () => (
  <footer className="site-footer">
    <div className="container site-footer__grid">
      <div>
        <Logo />
        <p>Тренируйся. Развивайся. Получай оффер.</p>
      </div>
      <div>
        <h3>Платформа</h3>
        <Link to="/questions">База вопросов</Link>
        <Link to="/trainer">Тренажёр</Link>
      </div>
      <div>
        <h3>Аккаунт</h3>
        <Link to="/login">Войти</Link>
        <Link to="/register">Регистрация</Link>
      </div>
    </div>
    <div className="container site-footer__bottom">© {new Date().getFullYear()} YeaHub</div>
  </footer>
);
