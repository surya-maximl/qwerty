import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCookie } from '../../core/utils/authUtils';

interface CustomError {
  data: {
    error: string;
    message: string;
    statusCode: number;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_BACKEND_URL}`,
  prepareHeaders: (headers) => {
    const token = getCookie('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}) as BaseQueryFn<string | FetchArgs, unknown, CustomError, {}>;

const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: ['Apps', 'User', 'Components'],
  endpoints: () => ({})
});

export default baseApi;
