import { useEffect, useRef, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { endSession, setToken, setUser, useRefreshMutation } from '@/features/auth';
import { useGetMeQuery } from '@/entities/user';
import { getTokenExpiration, isTokenExpired } from '@/shared/lib';

export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  // A token present at bootstrap means this session has already been established.
  // Keeping the flag set also prevents an explicit logout from immediately refreshing itself.
  const refreshAttempted = useRef(Boolean(token));
  const [refresh] = useRefreshMutation();
  const { data } = useGetMeQuery(undefined, { skip: !token || isTokenExpired(token) });

  useEffect(() => {
    if (!token) return;
    const expiration = getTokenExpiration(token);
    if (expiration === null || expiration <= Date.now()) {
      dispatch(endSession());
      return;
    }

    const timeout = window.setTimeout(() => dispatch(endSession()), expiration - Date.now());
    return () => window.clearTimeout(timeout);
  }, [dispatch, token]);

  useEffect(() => {
    if (token || refreshAttempted.current) return;
    refreshAttempted.current = true;
    refresh()
      .unwrap()
      .then((response) => {
        const nextToken = response.access_token ?? response.accessToken;
        if (nextToken) dispatch(setToken(nextToken));
      })
      .catch(() => dispatch(endSession()));
  }, [dispatch, refresh, token]);

  useEffect(() => {
    if (data) dispatch(setUser(data));
  }, [data, dispatch]);

  return children;
};
