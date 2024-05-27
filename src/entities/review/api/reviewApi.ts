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
      query: (params) => ({
        url: `/api/reviews/check_user_review_permission`,
        params: params,
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
