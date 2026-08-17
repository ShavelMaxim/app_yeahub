import { useEffect, useRef, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setToken, setUser, useRefreshMutation } from '@/features/auth';
import { useGetMeQuery } from '@/entities/user';

export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const refreshAttempted = useRef(false);
  const [refresh] = useRefreshMutation();
  const { data } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token || refreshAttempted.current) return;
    refreshAttempted.current = true;
    refresh()
      .unwrap()
      .then((response) => {
        const nextToken = response.access_token ?? response.accessToken;
        if (nextToken) dispatch(setToken(nextToken));
      })
      .catch(() => undefined);
  }, [dispatch, refresh, token]);

  useEffect(() => {
    if (data) dispatch(setUser(data));
  }, [data, dispatch]);

  return children;
};
