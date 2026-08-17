import { describe, expect, it } from 'vitest';
import { hasAdminRole, isTokenExpired } from './token';

const createToken = (exp: number) => `header.${btoa(JSON.stringify({ exp }))}.signature`;

describe('token helpers', () => {
  it('detects an expired token', () => {
    expect(isTokenExpired(createToken(Math.floor(Date.now() / 1000) - 60))).toBe(true);
  });

  it('accepts a token with a future expiration date', () => {
    expect(isTokenExpired(createToken(Math.floor(Date.now() / 1000) + 60))).toBe(false);
  });

  it('treats a malformed token as expired', () => {
    expect(isTokenExpired('not-a-jwt')).toBe(true);
  });

  it('uses only the roles returned for the user', () => {
    expect(hasAdminRole([{ name: 'USER' }, { name: 'ADMIN' }])).toBe(true);
    expect(hasAdminRole([{ name: 'USER' }])).toBe(false);
  });
});
