import { Link } from 'react-router-dom';
import githubIcon from '@/shared/config/assets/icons/Github.svg';
import figmaIcon from '@/shared/config/assets/icons/figma.svg';
import instagramIcon from '@/shared/config/assets/icons/Instagram.svg';
import telegramIcon from '@/shared/config/assets/icons/Telegram.svg';
import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <strong className={styles.brand}>Yeahub</strong>
      <p className={styles.slogan}>Выбери, каким будет IT завтра, вместе с нами</p>
      <div className={styles.socials}>
        <a
          href="https://www.youtube.com/@yeahub"
          aria-label="YeaHub на YouTube"
          className={styles.youtube}
        >
          ▶
        </a>
        <a href="https://github.com/YeaHubTeam" aria-label="YeaHub на GitHub">
          <img src={githubIcon} alt="" />
        </a>
        <a href="https://instagram.com/yeahub" aria-label="YeaHub в Instagram">
          <img src={instagramIcon} alt="" />
        </a>
        <a href="https://t.me/yeahub" aria-label="YeaHub в Telegram">
          <img src={telegramIcon} alt="" />
        </a>
      </div>
      <p className={styles.about}>
        YeaHub — полностью открытый проект, призванный объединить и улучшить IT-сферу. Исходный код
        доступен для просмотра на GitHub.
      </p>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} YeaHub</span>
        <div>
          <Link to="/questions">Документы</Link>
          <img src={figmaIcon} alt="Figma" />
          <img src={githubIcon} alt="GitHub" />
        </div>
      </div>
    </div>
  </footer>
);
