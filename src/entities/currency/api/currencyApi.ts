import { baseApi } from "@/shared/api";
import {
  GetAvailableValutesDtoRequest,
  GetAvailableValutesDtoResponse,
} from "./currencyDto";

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    availableValutes: build.query<
      GetAvailableValutesDtoResponse,
      GetAvailableValutesDtoRequest
    >({
      query: ({ base, city }) => ({
        url: `/api/test/available_valutes_2`,
        method: "GET",
        params: {
          city,
          base,
        },
      }),
    }),
  }),
});
export const { useAvailableValutesQuery } = currencyApi;
