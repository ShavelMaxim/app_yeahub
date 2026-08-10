import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setUser } from '@/features/auth';
import { useGetMeQuery } from '@/entities/user';

export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const { data } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data) dispatch(setUser(data));
  }, [data, dispatch]);

  return children;
};
