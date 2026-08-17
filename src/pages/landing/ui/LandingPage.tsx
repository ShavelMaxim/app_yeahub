import { Link } from 'react-router-dom';
import arrowLeftIcon from '@/shared/config/assets/icons/arrowLeftBtn.svg';
import arrowRightIcon from '@/shared/config/assets/icons/arrowRightBtn.svg';
import bookIcon from '@/shared/config/assets/icons/Book.svg';
import mapIcon from '@/shared/config/assets/icons/Map.svg';
import notebookIcon from '@/shared/config/assets/icons/Notebook.svg';
import specializationIcon from '@/shared/config/assets/icons/Specializaton.svg';
import supportIcon from '@/shared/config/assets/icons/support.svg';
import usersIcon from '@/shared/config/assets/icons/UsersThree.svg';
import videoIcon from '@/shared/config/assets/icons/Video.svg';
import alexanderAvatar from '@/shared/config/assets/pictres/landing/alexander.jpg';
import amalAvatar from '@/shared/config/assets/pictres/landing/amal.jpg';
import communityHeart from '@/shared/config/assets/pictres/landing/community-heart.jpg';
import denisAvatar from '@/shared/config/assets/pictres/landing/denis.jpg';
import dmitryAvatar from '@/shared/config/assets/pictres/landing/dmitry.jpg';
import malikaAvatar from '@/shared/config/assets/pictres/landing/malika.jpg';
import memberDark from '@/shared/config/assets/pictres/landing/member-dark.jpg';
import memberProject from '@/shared/config/assets/pictres/landing/member-project.jpg';
import ogarAvatar from '@/shared/config/assets/pictres/landing/ogar.jpg';
import philosophyPhoto from '@/shared/config/assets/pictres/landing/philosophy.jpg';
import privilegesTeam from '@/shared/config/assets/pictres/landing/privileges-team.jpg';
import reviewAnna from '@/shared/config/assets/pictres/landing/review-anna.png';
import reviewDmitry from '@/shared/config/assets/pictres/landing/review-dmitry.png';
import reviewNikolai from '@/shared/config/assets/pictres/landing/review-nikolai.png';
import verificationMan from '@/shared/config/assets/pictres/landing/verification-man.jpg';
import verificationTeam from '@/shared/config/assets/pictres/landing/verification-team.jpg';
import verificationWoman from '@/shared/config/assets/pictres/landing/verification-woman.jpg';
import verificationWomen from '@/shared/config/assets/pictres/landing/verification-women.jpg';
import yuriAvatar from '@/shared/config/assets/pictres/landing/yuri.jpg';
import styles from './LandingPage.module.css';

const members = [
  {
    name: 'Александр',
    role: 'Frontend developer',
    place: 'Россия, Нижний Новгород',
    avatar: alexanderAvatar,
    cover: memberDark,
    area: 'alexander',
  },
  {
    name: 'Дмитрий',
    role: 'Java developer',
    place: 'Россия, Брянск',
    avatar: dmitryAvatar,
    tone: 'lavender',
    area: 'dmitry',
  },
  {
    name: 'Огарь Светлана',
    role: 'UI/UX designer',
    place: 'Швеция, Стокгольм',
    avatar: ogarAvatar,
    area: 'ogar',
  },
  {
    name: 'Денис',
    role: 'Frontend developer',
    place: 'Россия, Таганрог',
    avatar: denisAvatar,
    area: 'denis',
  },
  {
    name: 'Амаль Ишанов',
    role: 'UI/UX designer',
    place: 'Узбекистан, Ташкент',
    avatar: amalAvatar,
    cover: memberProject,
    area: 'amal',
  },
  {
    name: 'Юрий',
    role: 'Frontend developer',
    place: 'Россия, Санкт-Петербург',
    avatar: yuriAvatar,
    tone: 'cream',
    area: 'yuri',
  },
];

const privileges = [
  {
    number: '01',
    title: 'Обучение',
    text: 'Получите доступ к базе знаний и плану обучения по выбранной IT-профессии. Отслеживайте свой прогресс, проходите курсы, стажируйтесь и получайте обратную связь.',
    icon: bookIcon,
  },
  {
    number: '02',
    title: 'Карьера',
    text: 'Ваш профиль YeaHub помогает продвигаться в карьере и показывает вашу активность в IT сообществе.',
    icon: specializationIcon,
  },
  {
    number: '03',
    title: 'Сообщество',
    text: 'Общайтесь с единомышленниками и обменивайтесь опытом. Ведите блог, пишите статьи и развивайте свой личный бренд.',
    icon: usersIcon,
  },
  {
    number: '04',
    title: 'Менторство',
    text: 'Обучайтесь под руководством менторов или передавайте свои знания, становясь ментором на YeaHub.',
    icon: supportIcon,
  },
  {
    number: '05',
    title: 'Проекты',
    text: 'Участвуйте в системе распределения заказов, объединяйтесь в команды и работайте над проектами, получая за это доход.',
    icon: notebookIcon,
  },
  {
    number: '06',
    title: 'События',
    text: 'Присоединяйтесь к конференциям, вебинарам, мастер-классам на YeaHub или станьте их организатором. Демонстрируйте свои навыки.',
    icon: videoIcon,
  },
];

const testimonials = [
  {
    name: 'Дмитрий Никольский',
    role: 'Backend developer',
    avatar: reviewDmitry,
    text: 'YeaHub предоставил мне платформу для обмена знаниями, которую я искал всю карьеру. Публиковать статьи и общаться с единомышленниками — бесценный опыт для специалиста с десятилетним стажем',
  },
  {
    name: 'Анна Мишина',
    role: 'UI/UX дизайнер',
    avatar: reviewAnna,
    text: 'Как начинающий разработчик, я чувствовал себя потерянным в огромном мире программирования. YeaHub помог мне построить чёткий учебный план, и теперь я чувствую себя увереннее и профессионально расту',
  },
  {
    name: 'Николай Журавлёва',
    role: 'Game developer',
    avatar: reviewNikolai,
    text: 'Впечатлён возможностями YeaHub по построению карьеры. Система рекомендаций и менторинга здесь — на высоте. Моя роль ментора также открыла мне новые горизонты для профессионального роста',
  },
];

const projectImages = [memberProject, memberDark, philosophyPhoto, verificationWomen];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>
          Сообщество
          <br />
          IT специалистов
        </h1>
        <p>
          YeaHub — это не просто платформа, это место, где профессионалы IT-индустрии общаются,
          обмениваются опытом и вдохновляют друг друга на новые достижения.
        </p>
        <Link className={styles.joinButton} to="/register">
          Присоединиться
        </Link>

        <div className={styles.membersGrid} aria-label="Участники сообщества">
          {members.map((member) => (
            <article
              className={`${styles.memberCard} ${member.tone ? styles[member.tone] : ''} ${member.cover ? styles.coverCard : ''}`}
              style={{
                gridArea: member.area,
                backgroundImage: member.cover
                  ? `linear-gradient(90deg, rgb(17 7 23 / 35%), rgb(17 7 23 / 10%)), url(${member.cover})`
                  : undefined,
              }}
              key={member.name}
            >
              <div className={styles.memberAvatar}>
                <img src={member.avatar} alt="" />
                <span>✓</span>
              </div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
              <small>
                <img src={mapIcon} alt="" />
                {member.place}
              </small>
            </article>
          ))}
          <article className={styles.communityCard}>
            <div className={styles.memberAvatar}>
              <img src={malikaAvatar} alt="" />
              <span>✓</span>
            </div>
            <strong>Бобоева Малика</strong>
            <span>Web-designer</span>
            <img className={styles.heartImage} src={communityHeart} alt="" />
            <small>
              <img src={mapIcon} alt="" />
              Таджикистан, Душанбе
            </small>
          </article>
        </div>
      </section>

      <section className={styles.philosophy} id="philosophy">
        <h2>Наша философия</h2>
        <div className={styles.philosophyGrid}>
          <div className={styles.communityVisual}>
            <img src={philosophyPhoto} alt="Участник сообщества за работой" />
            <div className={styles.quote}>
              <strong>Просто красавчик!</strong>
              <span>
                За участие и/или организацию
                <br />
                10 и более мероприятий
              </span>
            </div>
            <div className={styles.personBadge}>
              <img src={alexanderAvatar} alt="" />
              <strong>Руслан</strong>
              <span>Fullstack developer</span>
              <small>
                <img src={mapIcon} alt="" />
                Россия, Краснодар
              </small>
            </div>
          </div>
          <div className={styles.philosophyText}>
            <article>
              <h3>Сообщество специалистов</h3>
              <p>
                YeaHub — это не просто платформа, это сообщество верифицированных специалистов,
                которые прошли тщательную проверку знаний и подтвердили свои навыки. Это место, где
                профессионалы IT-индустрии общаются, обмениваются опытом и вдохновляют друг друга на
                новые достижения.
              </p>
            </article>
            <article>
              <h3>Профессиональный рост</h3>
              <p>
                Активное участие в жизни сообщества — не просто вклад в его развитие, но и
                возможность для самореализации. Если вы проводите собеседования, тестируете,
                оцениваете качества других специалистов, участвуете в опросах, пишете статьи,
                помогаете новичкам, то вам доступны все сервисы бесплатно без комиссии.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.joinSection} id="community">
        <div className={styles.joinIntro}>
          <h2>Как стать частью сообщества</h2>
          <p>
            Мы в YeaHub верим, что взаимная поддержка и обмен знаниями — ключ к успеху в быстро
            меняющемся мире IT. Присоединяйтесь к нам, подтвердите свои навыки и начните влиять на
            будущее IT уже сегодня.
          </p>
        </div>
        <div className={styles.joinScroller}>
          <article className={styles.joinCard}>
            <span className={styles.cardArrow}>↗</span>
            <div className={styles.projectsPreview}>
              <div className={styles.projectsHeader}>
                <span>Проекты</span>
                <small>Показать все&nbsp;&nbsp;&nbsp; Редактировать</small>
              </div>
              <div>
                {projectImages.map((image, index) => (
                  <img src={image} alt="" key={index} />
                ))}
              </div>
            </div>
            <p>
              Заполните ваш профиль, следуя нашим пошаговым подсказкам и гайдам. Создайте
              презентацию своих навыков, которая действительно выделяется.
            </p>
          </article>
          <article className={`${styles.joinCard} ${styles.joinCardPurple}`}>
            <span className={styles.cardArrow}>↗</span>
            <div className={styles.skillPreview}>
              <i />
              <i />
              <i />
              <i />
            </div>
            <p>
              Пройдите проверку знаний и получите подтверждение компетенций от теоретических знаний
              до практических навыков.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.profilePromo} id="profile-benefits">
        <h2>
          YeaHub помогает расти
          <br />и достигать целей
        </h2>
        <div className={styles.profileMockup}>
          <div className={styles.achievements}>
            Достижения (4)<span>♜ ★ ♛ ♞</span>
          </div>
          <p className={styles.profileCopyLeft}>
            Создайте свой профиль в котором будет отображаться вся ваша активность в жизни IT
            сообщества, уровень ваших навыков, написанные статьи, количество проведённых
            собеседований, посещённых конференций и митапов.
          </p>
          <div className={styles.profileSheet}>
            <div className={styles.profileNav}>
              Yeahub
              <br />
              <i />
              Главная
              <br />
              <b>Мой профиль</b>
              <br />
              Собеседования
              <br />
              Сервис
            </div>
            <div className={styles.profileBody}>
              <div className={styles.profileHeader}>
                <img src={reviewAnna} alt="" />
                <strong>Анастасия Заворотнюк</strong>
              </div>
              <div className={styles.profileLines}>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className={styles.profileProjects}>
                {projectImages.slice(0, 3).map((image, index) => (
                  <img src={image} alt="" key={index} />
                ))}
              </div>
            </div>
          </div>
          <p className={styles.profileCopyRight}>
            Это ваше лицо в сообществе YeaHub, видимое для других специалистов и работодателей. Это
            помогает продвигаться в карьере и показывает вашу активность в IT сообществе.
          </p>
          <div className={styles.profileQuote}>
            <strong>Просто красавчик!</strong>
            <span>
              За участие и/или организацию
              <br />
              10 и более мероприятий
            </span>
          </div>
        </div>
      </section>

      <section className={styles.verification} id="verification">
        <h2>Наша система проверки</h2>
        <div className={styles.verificationVisuals}>
          <img src={verificationMan} alt="" />
          <div className={styles.stat}>
            <strong>90%</strong>
            <span>
              дизайнеров
              <br />
              теперь с нами
            </span>
          </div>
          <img src={verificationWomen} alt="" />
          <img src={verificationTeam} alt="" />
          <div className={`${styles.stat} ${styles.statPurple}`}>
            <strong>80%</strong>
            <span>
              разработчиков
              <br />
              теперь с нами
            </span>
          </div>
          <img src={verificationWoman} alt="" />
        </div>
        <div className={styles.verificationCopy}>
          <strong>
            YeaHub объединяет
            <br />
            IT-специалистов
          </strong>
          <p>
            Стань частью сообщества, пройди проверку знаний. Этот процесс гарантирует, что каждый
            член YeaHub является компетентным специалистом, чьи навыки и знания были подтверждены.
          </p>
          <p>
            В основном это несколько этапов-собеседований с другими специалистами для проверки
            определённых навыков и качеств. После каждого этапа верификации вы получите обратную
            связь и оценку ваших знаний.
          </p>
        </div>
        <div className={styles.verificationMobile}>
          <div className={styles.verificationPair}>
            <img src={verificationMan} alt="" />
            <div className={styles.stat}>
              <strong>90%</strong>
              <span>
                дизайнеров
                <br />
                теперь с нами
              </span>
            </div>
          </div>
          <strong>YeaHub объединяет IT-специалистов</strong>
          <p>
            Стань частью сообщества, пройди проверку знаний. Этот процесс гарантирует, что каждый
            член YeaHub является компетентным специалистом, чьи навыки и знания были подтверждены.
          </p>
          <div className={styles.verificationPair}>
            <img src={verificationWomen} alt="" />
            <img src={verificationTeam} alt="" />
          </div>
          <p>
            В основном это несколько этапов-собеседований с другими специалистами для проверки
            определённых навыков и качеств. После каждого этапа верификации вы получите обратную
            связь и оценку ваших знаний.
          </p>
          <div className={styles.verificationPair}>
            <div className={`${styles.stat} ${styles.statPurple}`}>
              <strong>80%</strong>
              <span>
                разработчиков
                <br />
                теперь с нами
              </span>
            </div>
            <img src={verificationWoman} alt="" />
          </div>
        </div>
      </section>

      <section className={styles.privileges} id="privileges">
        <h2>
          Привилегии членства
          <br />в сообществе
        </h2>
        <div className={styles.privilegeLayout}>
          <div className={styles.privilegeCallout}>
            <img src={privilegesTeam} alt="" />
            <strong>
              Выбери, каким будет IT
              <br />
              завтра, вместе с YeaHub
            </strong>
          </div>
          <div className={styles.privilegeGrid}>
            {privileges.map((item, index) => (
              <article
                className={`${index === 1 || index === 4 ? styles.purpleCard : ''} ${index === 2 || index === 3 || index === 5 ? styles.creamCard : ''}`}
                key={item.number}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>{item.number}</span>
                <b>
                  <img src={item.icon} alt="" />
                </b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.reviews} id="reviews">
        <div className={styles.reviewsTitle}>
          <h2>Отзывы членов сообщества</h2>
        </div>
        <div className={styles.reviewGrid}>
          {testimonials.map((item, index) => (
            <article className={index === 1 ? styles.purpleCard : ''} key={item.name}>
              <p>«{item.text}»</p>
              <div>
                <img src={item.avatar} alt="" />
                <strong>
                  {item.name}
                  <small>{item.role}</small>
                </strong>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.reviewControls}>
          <button type="button" aria-label="Предыдущий отзыв">
            <img src={arrowLeftIcon} alt="" />
          </button>
          <button type="button" aria-label="Следующий отзыв">
            <img src={arrowRightIcon} alt="" />
          </button>
        </div>
      </section>
    </div>
  );
}
