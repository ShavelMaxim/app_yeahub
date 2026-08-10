import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { hasAdminRole, isTokenExpired } from '@/shared/lib';
import { EmptyState, Skeleton } from '@/shared/ui';

export const ProtectedRoute = ({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) => {
  const { token, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (admin && !user) {
    return (
      <section className="page-section container">
        <Skeleton lines={6} />
      </section>
    );
  }

  if (admin && !hasAdminRole(user?.userRoles)) {
    return (
      <section className="page-section container">
        <EmptyState
          icon="🔒"
          title="Недостаточно прав"
          description="Этот раздел доступен только пользователям с ролью администратора. Запросите роль у ментора."
        />
      </section>
    );
  }

  return children;
};
