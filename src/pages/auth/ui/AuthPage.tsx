import { Link, Navigate } from 'react-router-dom';
import { Button, Input, Logo } from '@/shared/ui';
import { useAuthForm, type AuthMode } from '@/features/auth';
import telegramIcon from '@/shared/config/assets/icons/Telegram.svg';
import eyeIcon from '@/shared/config/assets/icons/eye.svg';
import eyeCloseIcon from '@/shared/config/assets/icons/eyeClose.svg';
import { AuthAside } from './AuthAside';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  mode: AuthMode;
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

export default function AuthPage({ mode }: AuthPageProps) {
  const {
    confirmPasswordVisible,
    errors,
    isLogin,
    isSessionValid,
    isSubmitting,
    mailingAccepted,
    offerAccepted,
    passwordVisible,
    privacyAccepted,
    requestedRoute,
    serverError,
    setConfirmPasswordVisible,
    setMailingAccepted,
    setOfferAccepted,
    setPasswordVisible,
    setPrivacyAccepted,
    submit,
    update,
    values,
  } = useAuthForm(mode);

  if (isSessionValid) return <Navigate to={requestedRoute || '/dashboard'} replace />;

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
              loading={isSubmitting}
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
