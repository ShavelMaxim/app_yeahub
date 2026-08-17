import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Logo } from '@/shared/ui';
import envelope from '@/shared/config/assets/pictres/envelope_4977963 1.png';
import { AuthAside } from './AuthAside';
import authStyles from './AuthPage.module.css';
import styles from './PasswordRecoveryPage.module.css';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Укажите корректную электронную почту');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className={authStyles.page}>
      <AuthAside />
      <section className={authStyles.formWrap}>
        <div className={`${authStyles.formCard} ${styles.formCard}`}>
          <div className={authStyles.mobileLogo}>
            <Logo showWordmarkOnMobile />
          </div>
          <h1>Забыли пароль?</h1>
          <p className={styles.description}>
            Для восстановления пароля введите адрес эл.почты, на который вы регистрировались. Мы
            отправим письмо для восстановления пароля
          </p>
          <form onSubmit={submit} noValidate>
            <Input
              label="Электронная почта"
              type="email"
              autoComplete="email"
              value={email}
              error={error}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              placeholder="Введите электронную почту"
            />
            <Button className={styles.submit} type="submit" size="large" fullWidth>
              Отправить
            </Button>
          </form>
          <p className={authStyles.switch}>
            <span>Нет аккаунта?</span>
            <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </section>

      {sent && (
        <div className={styles.backdrop} role="presentation">
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recovery-sent-title"
          >
            <button
              className={styles.close}
              type="button"
              aria-label="Закрыть"
              onClick={() => setSent(false)}
            >
              ×
            </button>
            <img src={envelope} alt="" aria-hidden="true" />
            <h2 id="recovery-sent-title">
              Мы отправили письмо
              <br />с инструкциями
            </h2>
            <p>
              Если вы не получили письмо с инструкциями, проверьте, пожалуйста, папку «Спам» или
              попробуйте отправить запрос ещё раз
            </p>
            <button className={styles.resend} type="button" onClick={() => setSent(false)}>
              Отправить повторно
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
