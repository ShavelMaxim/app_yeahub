import { Link, useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/ui';

const directions = [
  { icon: 'JS', title: 'JavaScript', questions: '480+ вопросов', color: 'yellow' },
  { icon: 'TS', title: 'TypeScript', questions: '210+ вопросов', color: 'blue' },
  { icon: '⚛', title: 'React', questions: '320+ вопросов', color: 'cyan' },
  { icon: 'CSS', title: 'HTML & CSS', questions: '190+ вопросов', color: 'pink' },
];

const steps = [
  ['01', 'Выбери направление', 'Сфокусируйся на нужном стеке и уровне сложности.'],
  ['02', 'Изучай вопросы', 'Проверенные ответы и понятные объяснения вместо зубрёжки.'],
  ['03', 'Пройди тренировку', 'Симуляция собеседования покажет, что повторить.'],
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow">Твоя первая команда в IT</span>
            <h1>
              Подготовься к <span>IT-собеседованию</span> уверенно
            </h1>
            <p>Практикуй реальные вопросы, отслеживай прогресс и превращай знания в оффер.</p>
            <div className="hero__actions">
              <Button size="large" onClick={() => navigate('/register')}>
                Присоединиться бесплатно
              </Button>
              <Button variant="secondary" size="large" onClick={() => navigate('/questions')}>
                Смотреть вопросы
              </Button>
            </div>
            <div className="hero__proof">
              <div className="avatar-stack" aria-hidden="true">
                <span>А</span>
                <span>М</span>
                <span>К</span>
                <span>+</span>
              </div>
              <p>
                <strong>32 000+</strong>
                <br />
                разработчиков уже с нами
              </p>
            </div>
          </div>
          <div className="hero-visual" aria-label="Карточка тренировочного вопроса">
            <div className="orbit orbit--one" />
            <div className="orbit orbit--two" />
            <Card className="question-card">
              <div className="question-card__top">
                <span className="tag tag--purple">React</span>
                <span className="difficulty">
                  <i />
                  <i />
                  <i className="muted" /> Средний
                </span>
              </div>
              <span className="question-card__counter">Вопрос 8 из 15</span>
              <h2>Что такое Virtual DOM и как он работает?</h2>
              <div className="fake-answer">
                <span />
                <span />
                <span />
              </div>
              <div className="question-card__footer">
                <span>← Назад</span>
                <span className="mini-button">Показать ответ →</span>
              </div>
            </Card>
            <div className="floating-badge floating-badge--top">✓ 87% верных ответов</div>
            <div className="floating-badge floating-badge--bottom">🔥 12 дней подряд</div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">База знаний</span>
          <h2>Всё, что спросят на собеседовании</h2>
          <p>Актуальные вопросы, собранные разработчиками из реальных интервью.</p>
        </div>
        <div className="directions-grid">
          {directions.map((direction) => (
            <Card key={direction.title} interactive className="direction-card">
              <span className={`tech-icon tech-icon--${direction.color}`}>{direction.icon}</span>
              <div>
                <h3>{direction.title}</h3>
                <p>{direction.questions}</p>
              </div>
              <span className="arrow">→</span>
            </Card>
          ))}
        </div>
        <div className="centered">
          <Link className="text-link" to="/questions">
            Смотреть все направления →
          </Link>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Простой путь</span>
            <h2>От первого вопроса до оффера</h2>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <div className="step" key={number}>
                <span className="step__number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="cta-banner">
          <div>
            <span className="eyebrow eyebrow--light">Готов начать?</span>
            <h2>Твой следующий оффер ближе, чем кажется</h2>
            <p>Создай профиль и начни подготовку прямо сейчас.</p>
          </div>
          <Button size="large" variant="secondary" onClick={() => navigate('/register')}>
            Создать аккаунт
          </Button>
        </div>
      </section>
    </>
  );
}
