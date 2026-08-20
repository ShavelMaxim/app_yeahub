import { Link } from 'react-router-dom';
import moreIcon from '@/shared/config/assets/icons/popoverThreeDots.svg';
import chevronIcon from '@/shared/config/assets/icons/arrowMenuDown.svg';
import type { Question } from '../model/types';
import { RichTextContent } from './RichTextContent';
import styles from './QuestionAccordion.module.css';

interface QuestionAccordionProps {
  question: Question;
  isOpen: boolean;
  onToggle: () => void;
}

const getAnswer = (question: Question) =>
  question.longAnswer ||
  question.shortAnswer ||
  question.description ||
  'Подробный ответ для этого вопроса пока не добавлен.';

export const QuestionAccordion = ({ question, isOpen, onToggle }: QuestionAccordionProps) => {
  const panelId = `question-${question.id}-answer`;
  const complexity = question.complexity ?? '—';
  const rating = question.rate ?? '—';

  return (
    <article className={`${styles.question} ${isOpen ? styles.open : ''}`}>
      <button
        className={styles.trigger}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.title}>
          <span className={styles.dot} aria-hidden="true" />
          {question.title}
        </span>
        <img className={styles.chevron} src={chevronIcon} alt="" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.answer} id={panelId}>
          <div className={styles.metaRow}>
            <span className={styles.meta}>
              Рейтинг: <b>{rating}</b>
            </span>
            <span className={styles.meta}>
              Сложность: <b>{complexity}</b>
            </span>
            <button className={styles.more} type="button" aria-label="Дополнительные действия">
              <img src={moreIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <RichTextContent html={getAnswer(question)} />
          {!!question.questionSkills?.length && (
            <div className={styles.skills} aria-label="Навыки">
              {question.questionSkills.map((skill) => (
                <span key={skill.id}>{skill.title}</span>
              ))}
            </div>
          )}
          <Link className={styles.detailsLink} to={`/questions/${question.id}`}>
            Подробнее <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </article>
  );
};
