interface JwtPayload {
  exp?: number;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const [, payload] = token.split('.');
    if (!payload) return true;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized)) as JwtPayload;
    return typeof decoded.exp !== 'number' || decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const hasAdminRole = (roles: Array<{ name: string }> | undefined): boolean =>
  roles?.some((role) => role.name.toLowerCase() === 'admin') ?? false;
