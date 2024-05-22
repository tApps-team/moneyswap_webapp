import { baseApi } from "@/shared/api";
import {
  ReviewsByExchangeDtoRequest,
  ReviewsByExchangeDtoResponse,
} from "./reviewDto";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    reviewsByExchange: build.query<
      ReviewsByExchangeDtoResponse,
      ReviewsByExchangeDtoRequest
    >({
      query: ({
        element_on_page,
        exchange_id,
        exchange_marker,
        grade_filter,
        page,
      }) => ({
        url: `api/reviews/reviews_by_exchange?`,
        method: "GET",
      }),
    }),
  }),
});
