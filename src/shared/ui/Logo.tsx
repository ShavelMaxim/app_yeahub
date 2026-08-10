import { Link } from 'react-router-dom';

export const Logo = () => (
  <Link to="/" className="logo" aria-label="YeaHub — на главную">
    <span className="logo__mark" aria-hidden="true">
      Y
    </span>
    <span>YeaHub</span>
  </Link>
);
