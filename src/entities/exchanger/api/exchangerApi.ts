import { baseApi } from "@/shared/api";
import { Exchanger } from "../model";
import { DirectionsReq } from "./exchangerDto";

export const exchangerAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExchangers: build.query<Exchanger[], DirectionsReq>({
      query: (params) => ({
        url: `/api/directions`,
        method: "GET",
        params: params,
      }),
    }),
  }),
});
export const { useGetExchangersQuery } = exchangerAPI;
