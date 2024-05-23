import { baseApi } from "@/shared/api";
import {
  AvailableValutesDtoRequest,
  AvailableValutesDtoResponse,
} from "./currencyDto";
import { Currency, CurrencyLangCategory } from "../model/types/currency";

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    availableValutes: build.query<
      {
        currencies: AvailableValutesDtoResponse;
        filteredCurrency: {
          ru: Currency[];
          en: Currency[];
        };
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
          currencies: response,
          filteredCurrency: {
            en: Object.values(response.en).flat(),
            ru: Object.values(response.ru).flat(),
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
