import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn, hasAdminRole } from '@/shared/lib';
import { useAuth } from '@/features/auth';
import homeIcon from '@/shared/config/assets/icons/House.svg';
import profileIcon from '@/shared/config/assets/icons/userRounded.svg';
import learningIcon from '@/shared/config/assets/icons/Book.svg';
import interviewIcon from '@/shared/config/assets/icons/UsersThree.svg';
import roadmapIcon from '@/shared/config/assets/icons/Map.svg';
import knowledgeIcon from '@/shared/config/assets/icons/NotePencil.svg';
import resourceIcon from '@/shared/config/assets/icons/Notebook.svg';
import questionIcon from '@/shared/config/assets/icons/Document.svg';
import collectionIcon from '@/shared/config/assets/icons/BookmarkSimple.svg';
import adminIcon from '@/shared/config/assets/icons/gear.svg';
import supportIcon from '@/shared/config/assets/icons/support.svg';
import styles from './Sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
  nested?: boolean;
}

const NavItem = ({ to, icon, label, end, nested }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    title={label}
    className={({ isActive }) =>
      cn(styles.navItem, nested && styles.nested, isActive && styles.active)
    }
  >
    <img className={styles.navIcon} src={icon} alt="" aria-hidden="true" />
    <span className={styles.label}>{label}</span>
  </NavLink>
);

export const Sidebar = ({ collapsed, mobileOpen, onNavigate }: SidebarProps) => {
  const { user } = useAuth();
  const [learningOpen, setLearningOpen] = useState(true);
  const [knowledgeOpen, setKnowledgeOpen] = useState(true);

  return (
    <>
      <button
        className={cn(styles.backdrop, mobileOpen && styles.backdropVisible)}
        type="button"
        aria-label="Закрыть меню"
        onClick={onNavigate}
      />
      <aside
        className={cn(
          styles.sidebar,
          collapsed && styles.collapsed,
          mobileOpen && styles.mobileOpen,
        )}
        aria-label="Основная навигация"
      >
        <nav className={styles.navigation} onClick={onNavigate}>
          <NavItem to="/dashboard" icon={homeIcon} label="Главная" end />
          <NavItem to="/profile" icon={profileIcon} label="Мой профиль" />

          <div className={styles.group}>
            <button
              className={styles.groupButton}
              type="button"
              aria-expanded={learningOpen}
              onClick={(event) => {
                event.stopPropagation();
                setLearningOpen((open) => !open);
              }}
            >
              <img className={styles.navIcon} src={learningIcon} alt="" aria-hidden="true" />
              <span className={styles.label}>Обучение</span>
              <span
                className={cn(styles.chevron, learningOpen && styles.chevronOpen)}
                aria-hidden="true"
              />
            </button>
            {learningOpen && (
              <div className={styles.submenu}>
                <NavItem to="/interview" icon={interviewIcon} label="Собеседование" nested />
                <NavItem
                  to="/wiki/questions?page=1&status=all"
                  icon={roadmapIcon}
                  label="Roadmap"
                  nested
                />
              </div>
            )}
          </div>

          <div className={styles.group}>
            <button
              className={styles.groupButton}
              type="button"
              aria-expanded={knowledgeOpen}
              onClick={(event) => {
                event.stopPropagation();
                setKnowledgeOpen((open) => !open);
              }}
            >
              <img className={styles.navIcon} src={knowledgeIcon} alt="" aria-hidden="true" />
              <span className={styles.label}>Блог</span>
              <span
                className={cn(styles.chevron, knowledgeOpen && styles.chevronOpen)}
                aria-hidden="true"
              />
            </button>
            {knowledgeOpen && (
              <div className={styles.submenu}>
                <NavItem to="/questions" icon={resourceIcon} label="Все статьи" nested />
                <NavItem
                  to="/wiki/questions?page=1&status=all"
                  icon={questionIcon}
                  label="Мои статьи"
                  nested
                />
                <NavItem to="/trainer" icon={collectionIcon} label="Избранное" nested />
              </div>
            )}
          </div>

          {hasAdminRole(user?.userRoles) && (
            <NavItem to="/admin" icon={adminIcon} label="Админка" />
          )}
        </nav>

        <a className={styles.support} href="mailto:support@yeatwork.ru" title="Поддержка">
          <img src={supportIcon} alt="" aria-hidden="true" />
          <span className={styles.label}>Поддержка</span>
        </a>
      </aside>
    </>
  );
};
