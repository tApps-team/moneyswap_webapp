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
        url: `/api/v2/available_valutes`,
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
