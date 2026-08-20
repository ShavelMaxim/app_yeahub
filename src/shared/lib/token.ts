interface JwtPayload {
  exp?: number;
}

export const getTokenExpiration = (token: string | null): number | null => {
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized)) as JwtPayload;
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  const expiration = getTokenExpiration(token);
  return expiration === null || expiration <= Date.now();
};

export const hasAdminRole = (roles: Array<{ name: string }> | undefined): boolean =>
  roles?.some((role) => role.name.toLowerCase() === 'admin') ?? false;
