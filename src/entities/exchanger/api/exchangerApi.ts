import { baseApi } from "@/shared/api";
import { Exchanger } from "../model";
import { DirectionsCashReq, DirectionsNoncashReq } from "./exchangerDto";
import { EXCHANGER_CASH, EXCHANGER_NONCASH } from "@/shared/api/tags";

export const exchangerAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExchangersNoncash: build.query<Exchanger[], DirectionsNoncashReq>({
      query: (params) => ({
        url: `/api/test/directions`,
        method: "GET",
        params: params,
      }),
      providesTags: [EXCHANGER_NONCASH],
    }),
    getExchangersCash: build.query<Exchanger[], DirectionsCashReq>({
      query: (params) => ({
        url: `/api/test/directions`,
        method: "GET",
        params: params,
      }),
      providesTags: [EXCHANGER_CASH],
    }),
  }),
});
export const { useGetExchangersNoncashQuery, useGetExchangersCashQuery } =
  exchangerAPI;
