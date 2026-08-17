import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL ?? 'https://api.yeatwork.ru',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { token: string | null } }).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('accept', 'application/json');
    return headers;
  },
});

const baseQueryWithSession: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const requestUrl = typeof args === 'string' ? args : args.url;

  if (result.error?.status === 401 && requestUrl !== '/auth/refresh') {
    const refreshResult = await rawBaseQuery('/auth/refresh', api, extraOptions);
    const refreshData = refreshResult.data as
      { access_token?: string; accessToken?: string } | undefined;
    const token = refreshData?.access_token ?? refreshData?.accessToken;

    if (token) {
      api.dispatch({ type: 'auth/setToken', payload: token });
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: 'auth/clearCredentials' });
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithSession,
  tagTypes: ['Me', 'Profile', 'Specialization', 'Skill'],
  endpoints: () => ({}),
});
