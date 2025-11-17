import { baseApi } from "@/shared/api";
import { IncreaseDirectionCountReq } from "./directionDto";

export const directionAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    increaseDirectionCount: build.mutation<void, IncreaseDirectionCountReq>({
      query: (body) => ({
        url: `/api/test/increase_popular_count`,
        method: "POST",
        body,
      }),
    }),
  }),
});
export const {
  useIncreaseDirectionCountMutation,
} = directionAPI;
