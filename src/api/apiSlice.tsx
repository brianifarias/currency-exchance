import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.vatcomply.com',
  }),
  endpoints: (builder) => ({
    getRates: builder.query({
      query: () => '/rates',
    }),
    getCurrencies: builder.query({
      query: () => '/currencies',
    }),
    getRatesByBaseRate: builder.query({
      query: (base) => `/rates?base=${base}`,
    }),
  }),
});

export const { useGetRatesQuery, useGetCurrenciesQuery, useGetRatesByBaseRateQuery } = apiSlice;
