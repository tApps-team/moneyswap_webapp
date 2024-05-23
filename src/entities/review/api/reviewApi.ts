import { baseApi } from "@/shared/api";
import {
  AddReviewByExchangeDtoRequset,
  AddReviewByExchangeDtoResponse,
  CheckUserReviewPermissionDtoRequest,
  CheckUserReviewPermissionDtoResponse,
  ReviewsByExchangeDtoRequest,
  ReviewsByExchangeDtoResponse,
} from "./reviewDto";
import { createUrl } from "../utils/createUrl";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    reviewsByExchange: build.query<
      ReviewsByExchangeDtoResponse,
      ReviewsByExchangeDtoRequest
    >({
      query: (data) => ({
        url: createUrl(data),
        method: "GET",
      }),
      providesTags: ["REVIEW"],
    }),
    addReviewByExchange: build.mutation<
      AddReviewByExchangeDtoResponse,
      AddReviewByExchangeDtoRequset
    >({
      query: (data) => ({
        url: `/api/reviews/add_review_by_exchange`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["REVIEW"],
    }),
    checkUserReviewPermission: build.query<
      CheckUserReviewPermissionDtoResponse,
      CheckUserReviewPermissionDtoRequest
    >({
      query: ({ exchange_id, exchange_marker, tg_id }) => ({
        url: `/api/reviews/check_user_review_permission?exchange_id=${exchange_id}&exchange_marker=${exchange_marker}&tg_id=${tg_id}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useReviewsByExchangeQuery,
  useAddReviewByExchangeMutation,
  useLazyCheckUserReviewPermissionQuery,
} = reviewApi;
