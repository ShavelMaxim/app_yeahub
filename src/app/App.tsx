import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppLayout, PublicLayout } from '@/widgets/layout';
import { Skeleton } from '@/shared/ui';
import { ProtectedRoute } from './providers/ProtectedRoute';
import styles from './App.module.css';

const LandingPage = lazy(() => import('@/pages/landing'));
const AuthPage = lazy(() => import('@/pages/auth'));
const PasswordRecoveryPage = lazy(() =>
  import('@/pages/auth').then((module) => ({ default: module.PasswordRecoveryPage })),
);
const ChangePasswordPage = lazy(() =>
  import('@/pages/auth').then((module) => ({ default: module.ChangePasswordPage })),
);
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const ProfileEditPage = lazy(() =>
  import('@/pages/profile').then((module) => ({ default: module.ProfileEditPage })),
);
const AdminPage = lazy(() => import('@/pages/admin'));
const SpecializationPage = lazy(() => import('@/pages/specialization'));
const QuestionsPage = lazy(() => import('@/pages/questions'));
const QuestionPage = lazy(() => import('@/pages/question'));
const TrainerPage = lazy(() => import('@/pages/trainer'));
const TrainerQuizPage = lazy(() =>
  import('@/pages/trainer').then((module) => ({ default: module.TrainerQuizPage })),
);
const NotFoundPage = lazy(() => import('@/pages/not-found'));

const fallback = (
  <div className={styles.routeLoader}>
    <Skeleton lines={6} />
  </div>
);
const lazyPage = (page: ReactNode) => <Suspense fallback={fallback}>{page}</Suspense>;

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: lazyPage(<LandingPage />) },
      { path: '/questions', element: lazyPage(<QuestionsPage />) },
      { path: '/questions/:questionId', element: lazyPage(<QuestionPage />) },
      { path: '/trainer', element: lazyPage(<TrainerPage />) },
      { path: '/trainer/quiz', element: lazyPage(<TrainerQuizPage />) },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/wiki/questions', element: lazyPage(<QuestionsPage />) },
      { path: '/interview', element: lazyPage(<TrainerPage />) },
      {
        path: '/dashboard',
        element: <ProtectedRoute>{lazyPage(<DashboardPage />)}</ProtectedRoute>,
      },
      { path: '/profile', element: <ProtectedRoute>{lazyPage(<ProfilePage />)}</ProtectedRoute> },
      {
        path: '/profile/edit',
        element: <ProtectedRoute>{lazyPage(<ProfileEditPage />)}</ProtectedRoute>,
      },
      { path: '/admin', element: <ProtectedRoute admin>{lazyPage(<AdminPage />)}</ProtectedRoute> },
      {
        path: '/admin/specializations/new',
        element: <ProtectedRoute admin>{lazyPage(<AdminPage />)}</ProtectedRoute>,
      },
      {
        path: '/admin/specializations/:specializationId/edit',
        element: <ProtectedRoute admin>{lazyPage(<AdminPage />)}</ProtectedRoute>,
      },
      {
        path: '/admin/specializations/:specializationId',
        element: <ProtectedRoute admin>{lazyPage(<SpecializationPage />)}</ProtectedRoute>,
      },
    ],
  },
  { path: '/login', element: lazyPage(<AuthPage mode="login" />) },
  { path: '/register', element: lazyPage(<AuthPage mode="register" />) },
  { path: '/forgot-password', element: lazyPage(<PasswordRecoveryPage />) },
  { path: '/change-password', element: lazyPage(<ChangePasswordPage />) },
  { path: '/reset-password', element: lazyPage(<ChangePasswordPage />) },
  { path: '/404', element: lazyPage(<NotFoundPage />) },
  { path: '*', element: <Navigate to="/404" replace /> },
]);

export const App = () => <RouterProvider router={router} />;
