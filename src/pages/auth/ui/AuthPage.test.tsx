import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { authReducer } from '@/features/auth';
import { baseApi } from '@/shared/api';
import AuthPage from './AuthPage';

const renderLogin = () => {
  const store = configureStore({
    reducer: { auth: authReducer, [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
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
});
