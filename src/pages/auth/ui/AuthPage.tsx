import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, Logo } from '@/shared/ui';
import { setCredentials, useAuth, useLoginMutation, useRegisterMutation } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib';

interface AuthPageProps {
  mode: 'login' | 'register';
}

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validate = (values: FormValues, mode: AuthPageProps['mode']) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  const email = mode === 'login' ? values.username : values.email;
  if (!email.trim()) errors[mode === 'login' ? 'username' : 'email'] = 'Укажите email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors[mode === 'login' ? 'username' : 'email'] = 'Некорректный email';
  if (mode === 'register' && values.username.trim().length < 2)
    errors.username = 'Минимум 2 символа';
  if (values.password.length < 8) errors.password = 'Пароль должен содержать не менее 8 символов';
  if (mode === 'register' && values.password !== values.confirmPassword)
    errors.confirmPassword = 'Пароли не совпадают';
  return errors;
};

export default function AuthPage({ mode }: AuthPageProps) {
  const [values, setValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [serverError, setServerError] = useState('');
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const isLogin = mode === 'login';

  if (token) return <Navigate to="/dashboard" replace />;

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const response = isLogin
        ? await login({ username: values.username, password: values.password }).unwrap()
        : await register({
            username: values.username,
            email: values.email,
            password: values.password,
          }).unwrap();
      dispatch(setCredentials(response));
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/dashboard', { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-aside">
        <Logo />
        <div>
          <span className="eyebrow eyebrow--light">YeaHub</span>
          <h1>{isLogin ? 'Рады видеть тебя снова' : 'Начни путь к своему офферу'}</h1>
          <p>Системная подготовка, реальные вопросы и понятный прогресс в одном месте.</p>
        </div>
        <blockquote>«Уверенность приходит не до практики, а благодаря ей»</blockquote>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form-card">
          <div className="auth-mobile-logo">
            <Logo />
          </div>
          <span className="eyebrow">{isLogin ? 'С возвращением' : 'Бесплатный аккаунт'}</span>
          <h1>{isLogin ? 'Вход в YeaHub' : 'Создать аккаунт'}</h1>
          <p>
            {isLogin ? 'Введи данные своего аккаунта' : 'Заполни форму — это займёт меньше минуты'}
          </p>
          <form onSubmit={submit} noValidate>
            {!isLogin && (
              <Input
                label="Имя пользователя"
                name="username"
                autoComplete="username"
                value={values.username}
                error={errors.username}
                onChange={(e) => update('username', e.target.value)}
                placeholder="Алексей"
              />
            )}
            <Input
              label="Email"
              name={isLogin ? 'username' : 'email'}
              type="email"
              autoComplete="email"
              value={isLogin ? values.username : values.email}
              error={isLogin ? errors.username : errors.email}
              onChange={(e) => update(isLogin ? 'username' : 'email', e.target.value)}
              placeholder="name@example.com"
            />
            <Input
              label="Пароль"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={values.password}
              error={errors.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Не менее 8 символов"
            />
            {!isLogin && (
              <Input
                label="Повторите пароль"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="••••••••"
              />
            )}
            {serverError && (
              <div className="alert alert--error" role="alert">
                {serverError}
              </div>
            )}
            <Button
              type="submit"
              size="large"
              fullWidth
              loading={loginState.isLoading || registerState.isLoading}
            >
              {isLogin ? 'Войти' : 'Создать аккаунт'}
            </Button>
          </form>
          <p className="auth-switch">
            {isLogin ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <Link to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
