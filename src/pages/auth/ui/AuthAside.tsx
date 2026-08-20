import { Logo } from '@/shared/ui';
import styles from './AuthPage.module.css';

export const AuthAside = () => (
  <section className={styles.aside}>
    <div className={styles.asideBrand}>
      <Logo variant="secondary" size="large" />
      <p>YeaHub объединяет IT-специалистов</p>
    </div>
    <div className={styles.benefits}>
      <h2>
        Стань частью сообщества
        <br />
        YeaHub и получи:
      </h2>
      <ul>
        <li>Пошаговый план обучения</li>
        <li>Карьерный рост</li>
        <li>Большое сообщество специалистов</li>
        <li>Обучение с ментором</li>
        <li>Возможность прохождения стажировки</li>
      </ul>
    </div>
  </section>
);
