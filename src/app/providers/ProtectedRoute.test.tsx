import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { authReducer, type AuthState } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';

const validToken = `header.${btoa(
  JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3_600 }),
)}.signature`;

const renderAdminRoute = (auth: AuthState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin>
                <div>Admin content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('ProtectedRoute', () => {
  it('redirects a user without a valid token to login', () => {
    renderAdminRoute({ token: null, user: null });

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('denies the admin route when the server user has no admin role', () => {
    renderAdminRoute({
      token: validToken,
      user: { id: '1', username: 'user', email: 'user@example.com', userRoles: [] },
    });

    expect(screen.getByText('Недостаточно прав')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('renders the admin route only for a server-provided admin role', () => {
    renderAdminRoute({
      token: validToken,
      user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        userRoles: [{ id: 1, name: 'admin' }],
      },
    });

    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });
});
