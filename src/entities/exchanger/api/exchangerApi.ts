import { baseApi } from "@/shared/api";
import { Exchanger, ExchangerDetail } from "../model";
import { DirectionsCashReq, DirectionsNoncashReq } from "./exchangerDto";
import { EXCHANGER_CASH, EXCHANGER_NONCASH } from "@/shared/api/tags";
// import { ExchangerMarker } from "@/shared/types";

export const exchangerAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExchangersNoncash: build.query<Exchanger[], DirectionsNoncashReq>({
      query: (params) => ({
        url: `/api/v2/directions`,
        method: "GET",
        params: params,
      }),
      providesTags: [EXCHANGER_NONCASH],
    }),
    getExchangersCash: build.query<Exchanger[], DirectionsCashReq>({
      query: (params) => ({
        url: `/api/v2/directions`,
        method: "GET",
        params: params,
      }),
      providesTags: [EXCHANGER_CASH],
    }),
    getExchangerDetail: build.query<ExchangerDetail, {exchange_id: number}>({
      query: (params) => ({
        url: `/api/v2/exchange_detail`,
        method: "GET",
        params: params,
      }),
    }),
  }),
});
export const { useGetExchangersNoncashQuery, useGetExchangersCashQuery, useGetExchangerDetailQuery } =
  exchangerAPI;
