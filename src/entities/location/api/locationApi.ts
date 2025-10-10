import { baseApi } from "@/shared/api";
import { Country } from "../model";

export const locationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query<Country[], string>({
      query: () => ({
        url: "/api/v2/cash/countries",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetCountriesQuery } = locationApi;
