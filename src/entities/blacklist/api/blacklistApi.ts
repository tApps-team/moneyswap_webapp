import { baseApi } from "@/shared/api";
import { BLACKLIST } from "@/shared/api/tags";
import { BlacklistDetail, BlacklistItem } from "../model/blacklistTypes";

/**
 * Чёрный список живёт на том же api.moneyswap.online, что и обменники,
 * и требует заголовок `Moneyswap: true` — его уже проставляет baseApi.
 */
export const blacklistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBlacklist: build.query<BlacklistItem[], void>({
      query: () => ({ url: "/api/v2/exchangers_blacklist", method: "GET" }),
      providesTags: [BLACKLIST],
    }),
    getBlacklistDetail: build.query<BlacklistDetail, { exchange_id: number }>({
      query: (params) => ({
        url: "/api/v2/exchange_blacklist_detail",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetBlacklistQuery, useGetBlacklistDetailQuery } = blacklistApi;
