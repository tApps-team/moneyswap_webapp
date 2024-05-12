import { baseApi } from "@/shared/api";
import {
  AvailableValutesDtoRequest,
  AvailableValutesDtoResponse,
} from "./currencyDto";

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    availableValutes: build.query<
      {
        currencies: AvailableValutesDtoResponse;
        filteredCategories: { ru: string[]; en: string[] };
      },
      // AvailableValutesDtoResponse,
      AvailableValutesDtoRequest
    >({
      query: ({ base, city }) => ({
        url: city
          ? `/api/available_valutes?city=${city}&base=${base}`
          : `/api/available_valutes?base=${base}`,
        method: "GET",
      }),
      transformResponse: (response: AvailableValutesDtoResponse, meta, arg) => {
        return {
          currencies: {
            ru: Object.values(response.ru).flat(),
            en: Object.values(response.en).flat(),
          },
          filteredCategories: {
            ru: Object.keys(response.ru),
            en: Object.keys(response.en),
          },
        };
      },
    }),
  }),
});
export const { useAvailableValutesQuery } = currencyApi;
