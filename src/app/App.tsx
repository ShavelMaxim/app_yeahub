import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/widgets/layout';
import { Skeleton } from '@/shared/ui';
import { ProtectedRoute } from './providers/ProtectedRoute';

const LandingPage = lazy(() => import('@/pages/landing'));
const AuthPage = lazy(() => import('@/pages/auth'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const AdminPage = lazy(() => import('@/pages/admin'));
const QuestionsPage = lazy(() => import('@/pages/questions'));
const TrainerPage = lazy(() => import('@/pages/trainer'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

const fallback = (
  <div className="route-loader container">
    <Skeleton lines={6} />
  </div>
);
const lazyPage = (page: ReactNode) => <Suspense fallback={fallback}>{page}</Suspense>;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: lazyPage(<LandingPage />) },
      { path: '/questions', element: lazyPage(<QuestionsPage />) },
      { path: '/trainer', element: lazyPage(<TrainerPage />) },
      {
        path: '/dashboard',
        element: <ProtectedRoute>{lazyPage(<DashboardPage />)}</ProtectedRoute>,
      },
      { path: '/profile', element: <ProtectedRoute>{lazyPage(<ProfilePage />)}</ProtectedRoute> },
      { path: '/admin', element: <ProtectedRoute admin>{lazyPage(<AdminPage />)}</ProtectedRoute> },
      { path: '/404', element: lazyPage(<NotFoundPage />) },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
  { path: '/login', element: lazyPage(<AuthPage mode="login" />) },
  { path: '/register', element: lazyPage(<AuthPage mode="register" />) },
]);

export const App = () => <RouterProvider router={router} />;
