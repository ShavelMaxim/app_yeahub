import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { baseApi } from '@/shared/api';
import { clearCredentials } from './authSlice';

export const endSession = (): ThunkAction<void, unknown, unknown, UnknownAction> => (dispatch) => {
  dispatch(clearCredentials());
  dispatch(baseApi.util.resetApiState());
};

export const useEndSession = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(clearCredentials());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch]);
};
