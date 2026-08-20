import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { authReducer } from '@/features/auth';
import { baseApi } from '@/shared/api';
import AuthPage from './AuthPage';

const renderLogin = (token?: string) => {
  const store = configureStore({
    reducer: { auth: authReducer, [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState: token ? { auth: { token, user: null } } : undefined,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <AuthPage mode="login" />
      </MemoryRouter>
    </Provider>,
  );
};

describe('AuthPage', () => {
  it('validates login fields before sending a request', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Электронная почта'), 'invalid-email');
    await user.type(screen.getByLabelText('Пароль'), 'short');
    await user.click(screen.getByRole('button', { name: 'Вход' }));

    expect(screen.getByText('Некорректный email')).toBeInTheDocument();
    expect(screen.getByText('Пароль должен содержать не менее 8 символов')).toBeInTheDocument();
  });

  it('does not redirect away from login when the stored token is expired', () => {
    const expiredToken = `header.${btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 }),
    )}.signature`;
    const store = configureStore({
      reducer: { auth: authReducer, [baseApi.reducerPath]: baseApi.reducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
      preloadedState: { auth: { token: expiredToken, user: null } },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/dashboard" element={<div>Dashboard page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Вход в личный кабинет' })).toBeInTheDocument();
    expect(screen.queryByText('Dashboard page')).not.toBeInTheDocument();
  });
});
