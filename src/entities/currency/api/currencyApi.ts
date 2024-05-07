import { baseApi } from "@/shared/api";
import {
  AvailableValutesDtoRequest,
  AvailableValutesDtoResponse,
} from "./currencyDto";

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    availableValutes: build.query<
      AvailableValutesDtoResponse,
      AvailableValutesDtoRequest
    >({
      query: ({ base = "all", city }) => ({
        url: city
          ? `/api/available_valutes?city=${city}&base=${base}`
          : `/api/available_valutes?base=${base}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useAvailableValutesQuery } = currencyApi;
