import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Logo } from '@/shared/ui';
import eyeIcon from '@/shared/config/assets/icons/eye.svg';
import eyeCloseIcon from '@/shared/config/assets/icons/eyeClose.svg';
import styles from './ChangePasswordPage.module.css';

const EyeButton = ({ visible, toggle }: { visible: boolean; toggle: () => void }) => (
  <button
    className={styles.eye}
    type="button"
    aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
    onClick={toggle}
  >
    <img src={visible ? eyeIcon : eyeCloseIcon} alt="" />
  </button>
);

export default function ChangePasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmation?: string;
  }>({});
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Некорректный email';
    if (
      password.length < 8 ||
      !/[A-ZА-ЯЁ]/.test(password) ||
      !/\d/.test(password) ||
      !/[^\p{L}\d\s]/u.test(password)
    ) {
      nextErrors.password = 'Минимум 8 символов, заглавная буква, цифра и спецсимвол';
    }
    if (confirmation !== password) nextErrors.confirmation = 'Пароли не совпадают';
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setSaved(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.desktopBrand} to="/">
          Yeahub
        </Link>
        <div className={styles.mobileBrand}>
          <Logo showWordmarkOnMobile />
        </div>
        <nav>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </nav>
        <button className={styles.menu} type="button" aria-label="Открыть меню">
          <span />
          <span />
          <span />
        </button>
      </header>
      <main className={styles.card}>
        <h1>Изменение пароля</h1>
        <p>Пароль должен состоять минимум из 8 символов и содержать латинские буквы и цифры</p>
        <form onSubmit={submit} noValidate>
          <div className={styles.mobileEmail}>
            <Input
              label="Электронная почта"
              type="email"
              value={email}
              error={errors.email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              placeholder="Введите электронную почту"
            />
          </div>
          <Input
            label="Введите новый пароль"
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            error={errors.password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors({ ...errors, password: undefined });
            }}
            placeholder="Пароль"
            endIcon={
              <EyeButton
                visible={passwordVisible}
                toggle={() => setPasswordVisible((value) => !value)}
              />
            }
          />
          <Input
            label="Повторите пароль"
            type={confirmationVisible ? 'text' : 'password'}
            value={confirmation}
            error={errors.confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setErrors({ ...errors, confirmation: undefined });
            }}
            placeholder="Пароль"
            endIcon={
              <EyeButton
                visible={confirmationVisible}
                toggle={() => setConfirmationVisible((value) => !value)}
              />
            }
          />
          {saved && (
            <p className={styles.success} role="status">
              Пароль успешно изменён. Теперь можно войти.
            </p>
          )}
          <Button type="submit" size="large" fullWidth>
            Сохранить
          </Button>
        </form>
      </main>
    </div>
  );
}
