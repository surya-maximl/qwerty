import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    pokemonList: builder.query({
      query: () => '/pokemon'
    })
  })
});

export default baseApi;
export const { usePokemonListQuery } = baseApi;
