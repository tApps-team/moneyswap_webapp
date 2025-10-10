import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EXCHANGER_CASH, EXCHANGER_NONCASH, REVIEW } from "./tags";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Moneyswap', 'true');
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [EXCHANGER_CASH, EXCHANGER_NONCASH, REVIEW],
});
