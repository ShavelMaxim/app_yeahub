import { configureStore } from '@reduxjs/toolkit';
import { baseApi, configureApiSession } from '@/shared/api';
import { authReducer, endSession, setToken } from '@/features/auth';

export const store = configureStore({
  reducer: { auth: authReducer, [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

configureApiSession({
  getAccessToken: () => store.getState().auth.token,
  setAccessToken: (token) => store.dispatch(setToken(token)),
  clearSession: () => store.dispatch(endSession()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
