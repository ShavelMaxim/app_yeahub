import { describe, expect, it } from 'vitest';
import { authReducer, clearCredentials, setCredentials } from './authSlice';

describe('authSlice', () => {
  it('stores credentials', () => {
    const next = authReducer(
      undefined,
      setCredentials({
        access_token: 'header.payload.signature',
        user: { id: '1', username: 'alex', email: 'alex@example.com' },
      }),
    );
    expect(next.token).toBe('header.payload.signature');
    expect(next.user?.username).toBe('alex');
  });

  it('clears credentials', () => {
    const next = authReducer(
      {
        token: 'token',
        user: { id: '1', username: 'alex', email: 'alex@example.com' },
      },
      clearCredentials(),
    );
    expect(next).toEqual({ token: null, user: null });
  });
});
