import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './AppLayout.module.css';

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`${styles.appShell} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <Header
        collapsed={collapsed}
        onToggleSidebar={() => {
          setCollapsed((value) => !value);
          setMobileOpen((value) => !value);
        }}
      />
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
