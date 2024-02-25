import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCookie } from '../../core/utils/authUtils';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_BACKEND_URL}`,
  prepareHeaders: (headers) => {
    const token = getCookie('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: ['Apps', 'User'],
  endpoints: () => ({})
});

export default baseApi;
