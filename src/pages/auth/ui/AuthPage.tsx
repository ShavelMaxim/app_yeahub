import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, Logo } from '@/shared/ui';
import { setCredentials, useAuth, useLoginMutation, useRegisterMutation } from '@/features/auth';
import telegramIcon from '@/shared/config/assets/icons/Telegram.svg';
import eyeIcon from '@/shared/config/assets/icons/eye.svg';
import eyeCloseIcon from '@/shared/config/assets/icons/eyeClose.svg';
import { getApiErrorMessage } from '@/shared/lib';
import { AuthAside } from './AuthAside';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  mode: 'login' | 'register';
}

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordToggleProps {
  visible: boolean;
  onClick: () => void;
  label: string;
}

const PasswordToggle = ({ visible, onClick, label }: PasswordToggleProps) => (
  <button
    className={styles.eyeButton}
    type="button"
    aria-label={label}
    aria-pressed={visible}
    onClick={onClick}
  >
    <img src={visible ? eyeIcon : eyeCloseIcon} alt="" aria-hidden="true" />
  </button>
);

const validate = (values: FormValues, mode: AuthPageProps['mode']) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  const email = mode === 'login' ? values.username : values.email;
  if (!email.trim()) errors[mode === 'login' ? 'username' : 'email'] = 'Укажите email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors[mode === 'login' ? 'username' : 'email'] = 'Некорректный email';
  if (mode === 'register' && values.username.trim().length < 3)
    errors.username = 'Минимум 3 символа';
  else if (mode === 'register' && !/^[\p{L}\d]+$/u.test(values.username.trim()))
    errors.username = 'Используйте только буквы и цифры';
  if (values.password.length < 8) errors.password = 'Пароль должен содержать не менее 8 символов';
  else if (
    mode === 'register' &&
    (!/[A-ZА-ЯЁ]/.test(values.password) ||
      !/\d/.test(values.password) ||
      !/[^\p{L}\d\s]/u.test(values.password))
  )
    errors.password = 'Добавьте заглавную букву, цифру и специальный символ';
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(true);
  const [mailingAccepted, setMailingAccepted] = useState(true);
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const isLogin = mode === 'login';
  const requestedRoute = (location.state as { from?: string } | null)?.from;

  if (token) return <Navigate to={requestedRoute || '/dashboard'} replace />;

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || (!isLogin && !privacyAccepted)) return;

    try {
      const response = isLogin
        ? await login({ username: values.username, password: values.password }).unwrap()
        : await register({
            username: values.username,
            email: values.email,
            password: values.password,
          }).unwrap();
      dispatch(setCredentials(response));
      navigate(requestedRoute || '/dashboard', { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  return (
    <div className={`${styles.page} ${!isLogin ? styles.registerPage : ''}`}>
      <AuthAside />

      <section className={styles.formWrap}>
        <div className={styles.formCard}>
          <div className={styles.mobileLogo}>
            <Logo showWordmarkOnMobile />
          </div>
          <h1>{isLogin ? 'Вход в личный кабинет' : 'Регистрация'}</h1>
          <form onSubmit={submit} noValidate>
            {!isLogin && (
              <Input
                label="Никнейм"
                name="username"
                autoComplete="username"
                value={values.username}
                error={errors.username}
                onChange={(event) => update('username', event.target.value)}
                placeholder="Введите никнейм"
              />
            )}
            <Input
              label="Электронная почта"
              name={isLogin ? 'username' : 'email'}
              type="email"
              autoComplete="email"
              value={isLogin ? values.username : values.email}
              error={isLogin ? errors.username : errors.email}
              onChange={(event) => update(isLogin ? 'username' : 'email', event.target.value)}
              placeholder="Введите электронную почту"
            />
            <Input
              label="Пароль"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={values.password}
              error={errors.password}
              onChange={(event) => update('password', event.target.value)}
              placeholder="Введите пароль"
              endIcon={
                <PasswordToggle
                  visible={passwordVisible}
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                />
              }
            />
            {isLogin && (
              <Link className={styles.forgot} to="/forgot-password">
                Забыли пароль?
              </Link>
            )}
            {!isLogin && (
              <Input
                label="Подтвердить пароль"
                name="confirmPassword"
                type={confirmPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChange={(event) => update('confirmPassword', event.target.value)}
                placeholder="Введите пароль"
                endIcon={
                  <PasswordToggle
                    visible={confirmPasswordVisible}
                    onClick={() => setConfirmPasswordVisible((visible) => !visible)}
                    label={confirmPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                  />
                }
              />
            )}
            {serverError && (
              <div className={styles.error} role="alert">
                {serverError}
              </div>
            )}
            <Button
              className={styles.submitButton}
              type="submit"
              size="large"
              fullWidth
              disabled={!isLogin && !privacyAccepted}
              loading={loginState.isLoading || registerState.isLoading}
            >
              {isLogin ? 'Вход' : 'Зарегистрироваться'}
            </Button>

            {isLogin && (
              <div className={`${styles.socialLogin} ${styles.loginSocial}`}>
                <p>Зарегистрироваться через социальные сети</p>
                <button type="button" className={styles.telegramButton}>
                  <img src={telegramIcon} alt="" aria-hidden="true" />
                  <span>Log in with Telegram</span>
                </button>
              </div>
            )}

            {!isLogin && (
              <>
                <div className={styles.consents}>
                  <p>Проставив галочку («✓») и нажимая «Зарегистрироваться»:</p>
                  <label className={styles.consentRow}>
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(event) => setPrivacyAccepted(event.target.checked)}
                    />
                    <span className={styles.checkbox} aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      Даю согласие на <a href="#personal-data">обработку ПД</a>, в соответствии с{' '}
                      <a href="#privacy-policy">Политикой в отношении ПД</a>
                    </span>
                  </label>
                  {!privacyAccepted && (
                    <p className={styles.consentError} role="alert">
                      Вы должны согласиться с настоящими правилами и условиями
                    </p>
                  )}
                  <label className={styles.consentRow}>
                    <input
                      type="checkbox"
                      checked={offerAccepted}
                      onChange={(event) => setOfferAccepted(event.target.checked)}
                    />
                    <span className={styles.checkbox} aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      Я подтверждаю что ознакомился(-ась) с <a href="#offer">Договором-офертой</a>
                    </span>
                  </label>
                  <label className={styles.consentRow}>
                    <input
                      type="checkbox"
                      checked={mailingAccepted}
                      onChange={(event) => setMailingAccepted(event.target.checked)}
                    />
                    <span className={styles.checkbox} aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      Даю согласие на получение рекламных и информационных{' '}
                      <a href="#mailing">рассылок</a>
                    </span>
                  </label>
                </div>

                <div className={styles.socialLogin}>
                  <p>Зарегистрироваться через социальные сети</p>
                  <button type="button" className={styles.telegramButton}>
                    <img src={telegramIcon} alt="" aria-hidden="true" />
                    <span>Log in with Telegram</span>
                  </button>
                </div>
              </>
            )}
          </form>
          <p className={styles.switch}>
            <span>{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}</span>
            <Link to={isLogin ? '/register' : '/login'}>
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
